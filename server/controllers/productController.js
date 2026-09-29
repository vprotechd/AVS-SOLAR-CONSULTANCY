import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import Product from "../models/Product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SERVER_ROOT = path.join(__dirname, "..");
const UPLOADS_ROOT = path.join(SERVER_ROOT, "uploads");
const IS_PROD = process.env.NODE_ENV === "production";

/* ================= HELPERS ================= */

const getImageUrl = (image, req) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  const base = process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;
  return `${base}${image.startsWith("/") ? image : `/uploads/products/${image}`}`;
};

const formatProduct = (product, req) => ({
  ...product,
  id: product._id,
  image: getImageUrl(product.image, req),
});

const deleteImageFile = (image) => {
  try {
    if (!image || /^https?:\/\//i.test(image)) return;

    const filePath = path.resolve(SERVER_ROOT, image.replace(/^\/+/, ""));

    // Safety: only ever delete inside /uploads
    if (!filePath.startsWith(UPLOADS_ROOT)) return;

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Failed to delete product image:", err.message);
  }
};

const cleanupUploaded = (req) => {
  if (req.file?.path && fs.existsSync(req.file.path)) {
    try {
      fs.unlinkSync(req.file.path);
    } catch {
      /* ignore */
    }
  }
};

// multipart sends everything as strings
const toBool = (v, fallback = false) =>
  v === undefined || v === null || v === ""
    ? fallback
    : v === true || String(v) === "true";

const toNumberOrNull = (v) =>
  v === undefined || v === null || v === "" ? null : Number(v);

// Always returns [{ name, value }]
const parseSpecifications = (value) => {
  if (value === undefined || value === null || value === "") return [];

  let list = value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      list =
        parsed && typeof parsed === "object"
          ? parsed
          : value.split(/\r?\n/);
    } catch {
      list = value.split(/\r?\n/); // plain textarea text
    }
  }

  if (!Array.isArray(list)) {
    if (list && typeof list === "object") {
      list = Object.entries(list).map(([name, val]) => ({ name, value: val }));
    } else {
      return [];
    }
  }

  return list
    .map((item) => {
      if (item && typeof item === "object") {
        return {
          name: String(item.name ?? item.key ?? "").trim(),
          value: String(item.value ?? "").trim(),
        };
      }

      const line = String(item).trim();
      const i = line.indexOf(":");

      return i === -1
        ? { name: line, value: "" }
        : {
            name: line.slice(0, i).trim(),
            value: line.slice(i + 1).trim(),
          };
    })
    .filter((spec) => spec.name);
};

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// One place to turn any thrown error into a useful response
const sendServerError = (res, error, message) => {
  console.error(`${message}:`, error);

  if (error?.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: Object.values(error.errors)
        .map((e) => e.message)
        .join(", "),
    });
  }

  if (error?.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || "value";
    return res.status(409).json({
      success: false,
      message: `A product with this ${field} already exists`,
    });
  }

  return res.status(500).json({
    success: false,
    message,
    ...(IS_PROD ? {} : { error: error?.message }),
  });
};

/* ================= READ ================= */

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    return res.json({
      success: true,
      products: products.map((p) => formatProduct(p, req)),
    });
  } catch (error) {
    return sendServerError(res, error, "Failed to load products");
  }
};

export const getPublicProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ featured: -1, createdAt: -1 })
      .lean();
    return res.json({
      success: true,
      products: products.map((p) => formatProduct(p, req)),
    });
  } catch (error) {
    return sendServerError(res, error, "Failed to load products");
  }
};

export const getPublicProduct = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid product id" });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    }).lean();

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.json({ success: true, product: formatProduct(product, req) });
  } catch (error) {
    return sendServerError(res, error, "Failed to load product");
  }
};

export const getProduct = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid product id" });
    }

    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.json({ success: true, product: formatProduct(product, req) });
  } catch (error) {
    return sendServerError(res, error, "Failed to load product");
  }
};

/* ================= CREATE ================= */

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      brand,
      sku,
      description,
      price,
      discountPrice,
      stock,
      featured,
      isActive,
      specifications,
    } = req.body || {}; // ✅ never crashes if body is undefined

    if (!String(name || "").trim()) {
      cleanupUploaded(req);
      return res.status(400).json({ success: false, message: "Product name is required" });
    }

    if (!String(category || "").trim()) {
      cleanupUploaded(req);
      return res.status(400).json({ success: false, message: "Product category is required" });
    }

    const numericPrice = Number(price);
    if (price === undefined || price === "" || Number.isNaN(numericPrice) || numericPrice < 0) {
      cleanupUploaded(req);
      return res.status(400).json({ success: false, message: "Valid product price is required" });
    }

    const numericDiscount = toNumberOrNull(discountPrice);
    if (numericDiscount !== null && (Number.isNaN(numericDiscount) || numericDiscount < 0)) {
      cleanupUploaded(req);
      return res.status(400).json({ success: false, message: "Invalid discount price" });
    }
    if (numericDiscount !== null && numericDiscount > numericPrice) {
      cleanupUploaded(req);
      return res.status(400).json({
        success: false,
        message: "Discount price cannot be greater than original price",
      });
    }

    const numericStock = toNumberOrNull(stock) ?? 0;
    if (Number.isNaN(numericStock) || numericStock < 0) {
      cleanupUploaded(req);
      return res.status(400).json({ success: false, message: "Invalid stock quantity" });
    }

    // Image comes from the uploaded file, stored as a relative path
    const image = req.file ? `/uploads/products/${req.file.filename}` : "";

    const product = await Product.create({
      name: String(name).trim(),
      category: String(category).trim(),
      brand: String(brand || "").trim(),
      sku: String(sku || "").trim(),
      description: String(description || "").trim(),
      price: numericPrice,
      discountPrice: numericDiscount,
      stock: numericStock,
      image,
      featured: toBool(featured),
      isActive: toBool(isActive, true),
      specifications: parseSpecifications(specifications),
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: formatProduct(product.toObject(), req),
    });
  } catch (error) {
    cleanupUploaded(req);
    return sendServerError(res, error, "Failed to create product");
  }
};

/* ================= UPDATE ================= */

export const updateProduct = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      cleanupUploaded(req);
      return res.status(400).json({ success: false, message: "Invalid product id" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      cleanupUploaded(req);
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const b = req.body || {}; // ✅ never crashes if body is undefined
    const has = (f) => Object.prototype.hasOwnProperty.call(b, f);

    if (has("name")) product.name = String(b.name || "").trim();
    if (has("category")) product.category = String(b.category || "").trim();
    if (has("brand")) product.brand = String(b.brand || "").trim();
    if (has("sku")) product.sku = String(b.sku || "").trim();
    if (has("description")) product.description = String(b.description || "").trim();
    if (has("price")) product.price = Number(b.price);
    if (has("discountPrice")) product.discountPrice = toNumberOrNull(b.discountPrice);
    if (has("stock")) product.stock = toNumberOrNull(b.stock) ?? 0;
    if (has("featured")) product.featured = toBool(b.featured);
    if (has("isActive")) product.isActive = toBool(b.isActive, true);
    if (has("specifications")) {
      product.specifications = parseSpecifications(b.specifications);
    }

    if (!product.name) {
      cleanupUploaded(req);
      return res.status(400).json({ success: false, message: "Product name is required" });
    }
    if (Number.isNaN(product.price) || product.price < 0) {
      cleanupUploaded(req);
      return res.status(400).json({ success: false, message: "Invalid price" });
    }
    if (
      product.discountPrice !== null &&
      product.discountPrice !== undefined &&
      (Number.isNaN(product.discountPrice) || product.discountPrice > product.price)
    ) {
      cleanupUploaded(req);
      return res.status(400).json({
        success: false,
        message: "Discount price cannot be greater than original price",
      });
    }
    if (Number.isNaN(product.stock) || product.stock < 0) {
      cleanupUploaded(req);
      return res.status(400).json({ success: false, message: "Invalid stock quantity" });
    }

    // Image handling
    const oldImage = product.image;

    if (req.file) {
      product.image = `/uploads/products/${req.file.filename}`;
    } else if (toBool(b.removeImage)) {
      product.image = "";
    }

    await product.save();

    if (oldImage && oldImage !== product.image) deleteImageFile(oldImage);

    return res.json({
      success: true,
      message: "Product updated successfully",
      product: formatProduct(product.toObject(), req),
    });
  } catch (error) {
    cleanupUploaded(req);
    return sendServerError(res, error, "Failed to update product");
  }
};

/* ================= DELETE ================= */

export const deleteProduct = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid product id" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    deleteImageFile(product.image);
    await product.deleteOne();

    return res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return sendServerError(res, error, "Failed to delete product");
  }
};