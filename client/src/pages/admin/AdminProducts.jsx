import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiPackage,
  FiSearch,
  FiRefreshCw,
  FiCheck,
  FiX,
  FiStar,
  FiDollarSign,
  FiBox,
  FiTag,
  FiUpload,
} from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../services/api";
import "./AdminProducts.css";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const emptyForm = {
  name: "",
  category: "",
  brand: "",
  sku: "",
  description: "",
  price: "",
  discountPrice: "",
  stock: "",
  featured: false,
  isActive: true,
  specifications: "",
};

// ============================================================
// IMAGE URL HELPERS
// ============================================================

const getBackendUrl = () => {
  const apiUrl =
    import.meta.env.VITE_API_URL ||
    api?.defaults?.baseURL ||
    "";

  if (apiUrl) {
    try {
      return new URL(apiUrl, window.location.origin).origin;
    } catch {
      // ignore and use fallback
    }
  }

  return "http://localhost:5000";
};

const getImageUrl = (image) => {
  if (!image) return "";

  const value = String(image).trim().replace(/\\/g, "/");

  if (!value) return "";

  // Full URL / browser preview
  if (/^(https?:|blob:|data:)/i.test(value)) {
    return value;
  }

  // Relative path such as /uploads/products/file.jpg
  return `${getBackendUrl()}${
    value.startsWith("/") ? value : `/${value}`
  }`;
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState(emptyForm);

  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [removeImage, setRemoveImage] = useState(false);

  const fileInputRef = useRef(null);

  // ============================================================
  // CLEAN UP BLOB PREVIEW URLS
  // Runs when the preview changes and when the page unmounts.
  // ============================================================

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const resetImageState = () => {
    setImageFile(null);
    setImagePreview("");
    setRemoveImage(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ============================================================
  // LOAD PRODUCTS
  // ============================================================

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products");

      const data =
        response?.data?.products ||
        response?.products ||
        [];

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load products error:", error);

      toast.error(
        getErrorMessage(error, "Unable to load products")
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ============================================================
  // FORM CHANGE
  // ============================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ============================================================
  // IMAGE CHANGE
  // ============================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      );

      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be less than 5MB");

      e.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveImage(false);
  };

  // ============================================================
  // REMOVE IMAGE
  // ============================================================

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");

    // Only tell the server to delete if the product had an image
    setRemoveImage(Boolean(editingProduct?.image));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ============================================================
  // ADD PRODUCT
  // ============================================================

  const handleAdd = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    resetImageState();
    setShowModal(true);
  };

  // ============================================================
  // EDIT PRODUCT
  // ============================================================

  const handleEdit = (product) => {
    setEditingProduct(product);

    let specifications = "";

    if (Array.isArray(product.specifications)) {
      specifications = product.specifications
        .map((item) => {
          if (typeof item === "object" && item !== null) {
            const name = item.name || item.key || "";
            const value = item.value || "";

            return value ? `${name}: ${value}` : name;
          }

          return String(item);
        })
        .join("\n");
    } else if (
      typeof product.specifications === "object" &&
      product.specifications !== null
    ) {
      specifications = Object.entries(product.specifications)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");
    } else {
      specifications = product.specifications || "";
    }

    setForm({
      name: product.name || "",
      category: product.category || "",
      brand: product.brand || "",
      sku: product.sku || "",
      description: product.description || "",
      price: product.price !== undefined ? product.price : "",
      discountPrice:
        product.discountPrice !== undefined &&
        product.discountPrice !== null
          ? product.discountPrice
          : "",
      stock: product.stock !== undefined ? product.stock : "",
      featured: Boolean(product.featured),
      isActive:
        typeof product.isActive === "boolean"
          ? product.isActive
          : true,
      specifications,
    });

    // Reset the file input, then show the current saved image
    resetImageState();
    setImagePreview(getImageUrl(product.image));

    setShowModal(true);
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingProduct(null);
    setForm(emptyForm);
    resetImageState();
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Please enter product name");
      return false;
    }

    if (!form.category.trim()) {
      toast.error("Please enter product category");
      return false;
    }

    if (form.price === "" || form.price === null) {
      toast.error("Please enter product price");
      return false;
    }

    const price = Number(form.price);

    if (Number.isNaN(price) || price < 0) {
      toast.error("Please enter a valid price");
      return false;
    }

    if (form.discountPrice !== "") {
      const discountPrice = Number(form.discountPrice);

      if (Number.isNaN(discountPrice) || discountPrice < 0) {
        toast.error("Please enter a valid discount price");
        return false;
      }

      if (discountPrice > price) {
        toast.error(
          "Discount price cannot be greater than original price"
        );
        return false;
      }
    }

    if (form.stock !== "") {
      const stock = Number(form.stock);

      if (Number.isNaN(stock) || stock < 0) {
        toast.error("Please enter a valid stock quantity");
        return false;
      }
    }

    return true;
  };

  // ============================================================
  // PARSE SPECIFICATIONS
  // ============================================================

  const parseSpecifications = () => {
    if (!form.specifications.trim()) {
      return [];
    }

    return form.specifications
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separatorIndex = line.indexOf(":");

        if (separatorIndex === -1) {
          return {
            name: line,
            value: "",
          };
        }

        return {
          name: line.slice(0, separatorIndex).trim(),
          value: line.slice(separatorIndex + 1).trim(),
        };
      });
  };

  // ============================================================
  // SAVE PRODUCT (multipart/form-data)
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("category", form.category.trim());
      formData.append("brand", form.brand.trim());
      formData.append("sku", form.sku.trim());
      formData.append("description", form.description.trim());

      formData.append("price", String(Number(form.price)));

      formData.append(
        "discountPrice",
        form.discountPrice === ""
          ? ""
          : String(Number(form.discountPrice))
      );

      formData.append(
        "stock",
        form.stock === "" ? "0" : String(Number(form.stock))
      );

      formData.append("featured", String(Boolean(form.featured)));
      formData.append("isActive", String(Boolean(form.isActive)));

      formData.append(
        "specifications",
        JSON.stringify(parseSpecifications())
      );

      // Field name MUST be "image" (matches upload.single("image"))
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (editingProduct && removeImage) {
        formData.append("removeImage", "true");
      }

      if (editingProduct) {
        await api.put(
          `/products/${editingProduct._id}`,
          formData
        );

        toast.success("Product updated successfully");
      } else {
        await api.post("/products", formData);

        toast.success("Product added successfully");
      }

      // closeModal() is blocked while saving, so reset manually
      setSaving(false);
      closeModal();

      await loadProducts();
    } catch (error) {
      console.error("Save product error:", error);
      console.error("Server response:", error?.response?.data);

      toast.error(
        getErrorMessage(
          error,
          `Unable to ${editingProduct ? "update" : "add"} product`
        )
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // DELETE PRODUCT
  // ============================================================

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/products/${product._id}`);

      toast.success("Product deleted successfully");

      setProducts((prev) =>
        prev.filter((item) => item._id !== product._id)
      );
    } catch (error) {
      console.error("Delete product error:", error);

      toast.error(
        getErrorMessage(error, "Unable to delete product")
      );
    }
  };

  // ============================================================
  // TOGGLE STATUS
  // Sends ONLY the changed field
  // ============================================================

  const handleToggleStatus = async (product) => {
    try {
      await api.put(`/products/${product._id}`, {
        isActive: !product.isActive,
      });

      setProducts((prev) =>
        prev.map((item) =>
          item._id === product._id
            ? { ...item, isActive: !item.isActive }
            : item
        )
      );

      toast.success(
        product.isActive
          ? "Product deactivated"
          : "Product activated"
      );
    } catch (error) {
      console.error("Toggle product status error:", error);

      toast.error(
        getErrorMessage(error, "Unable to update product status")
      );
    }
  };

  // ============================================================
  // TOGGLE FEATURED
  // Sends ONLY the changed field
  // ============================================================

  const handleToggleFeatured = async (product) => {
    try {
      await api.put(`/products/${product._id}`, {
        featured: !product.featured,
      });

      setProducts((prev) =>
        prev.map((item) =>
          item._id === product._id
            ? { ...item, featured: !item.featured }
            : item
        )
      );

      toast.success(
        product.featured
          ? "Removed from featured products"
          : "Added to featured products"
      );
    } catch (error) {
      console.error("Toggle featured error:", error);

      toast.error(
        getErrorMessage(error, "Unable to update featured status")
      );
    }
  };

  // ============================================================
  // CATEGORIES
  // ============================================================

  const categories = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product.category?.trim())
          .filter(Boolean)
      ),
    ].sort();
  }, [products]);

  // ============================================================
  // FILTER PRODUCTS
  // ============================================================

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.sku?.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "all" ||
        product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active"
          ? product.isActive
          : !product.isActive);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  // ============================================================
  // HELPERS
  // ============================================================

  const getProductPrice = (product) => {
    const price = Number(product.price || 0);

    const discount =
      product.discountPrice !== null &&
      product.discountPrice !== undefined &&
      product.discountPrice !== ""
        ? Number(product.discountPrice)
        : null;

    return {
      price,
      discount,
      hasDiscount: discount !== null && discount < price,
    };
  };

  const getStockStatus = (stock) => {
    const quantity = Number(stock || 0);

    if (quantity <= 0) {
      return { text: "Out of Stock", className: "out" };
    }

    if (quantity <= 5) {
      return {
        text: `Low Stock (${quantity})`,
        className: "low",
      };
    }

    return {
      text: `${quantity} in stock`,
      className: "available",
    };
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="admin-products-page">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="admin-products-header">
        <div>
          <h1>Product Management</h1>

          <p>Manage products available in your solar store</p>
        </div>

        <button
          type="button"
          className="admin-products-add-btn"
          onClick={handleAdd}
        >
          <FiPlus />
          Add Product
        </button>
      </div>

      {/* ======================================================
          STATISTICS
      ====================================================== */}

      <div className="admin-products-stats">
        <div className="admin-products-stat-card">
          <div className="admin-products-stat-icon">
            <FiPackage />
          </div>

          <div>
            <span>Total Products</span>
            <strong>{products.length}</strong>
          </div>
        </div>

        <div className="admin-products-stat-card">
          <div className="admin-products-stat-icon">
            <FiCheck />
          </div>

          <div>
            <span>Active Products</span>
            <strong>
              {products.filter((product) => product.isActive).length}
            </strong>
          </div>
        </div>

        <div className="admin-products-stat-card">
          <div className="admin-products-stat-icon">
            <FiBox />
          </div>

          <div>
            <span>Out of Stock</span>
            <strong>
              {
                products.filter(
                  (product) => Number(product.stock || 0) <= 0
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="admin-products-stat-card">
          <div className="admin-products-stat-icon">
            <FiStar />
          </div>

          <div>
            <span>Featured</span>
            <strong>
              {products.filter((product) => product.featured).length}
            </strong>
          </div>
        </div>
      </div>

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <div className="admin-products-toolbar">
        <div className="admin-products-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search products, brand or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-products-filters">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>

            {categories.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            type="button"
            className="admin-products-refresh"
            onClick={loadProducts}
            disabled={loading}
          >
            <FiRefreshCw
              className={loading ? "admin-products-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* ======================================================
          PRODUCTS
      ====================================================== */}

      {loading ? (
        <div className="admin-products-loading">
          <div className="admin-products-loader"></div>

          <p>Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="admin-products-empty">
          <FiPackage />

          <h3>
            {search ||
            categoryFilter !== "all" ||
            statusFilter !== "all"
              ? "No products found"
              : "No products yet"}
          </h3>

          <p>
            {search ||
            categoryFilter !== "all" ||
            statusFilter !== "all"
              ? "Try changing your filters."
              : "Add your first product to start selling."}
          </p>

          {!search &&
            categoryFilter === "all" &&
            statusFilter === "all" && (
              <button
                type="button"
                className="admin-products-add-btn"
                onClick={handleAdd}
              >
                <FiPlus />
                Add Product
              </button>
            )}
        </div>
      ) : (
        <div className="admin-products-grid">
          {filteredProducts.map((product) => {
            const pricing = getProductPrice(product);
            const stockStatus = getStockStatus(product.stock);
            const productImageUrl = getImageUrl(product.image);

            return (
              <div
                className={`admin-product-card ${
                  !product.isActive
                    ? "admin-product-card-inactive"
                    : ""
                }`}
                key={product._id}
              >
                {/* IMAGE */}

                <div className="admin-product-image">
                  {productImageUrl ? (
                    <img
                      src={productImageUrl}
                      alt={product.name}
                      onError={(e) => {
                        console.error(
                          "Failed to load product image:",
                          productImageUrl
                        );

                        e.currentTarget.style.display = "none";

                        const fallback =
                          e.currentTarget.nextSibling;

                        if (fallback) {
                          fallback.style.display = "flex";
                        }
                      }}
                    />
                  ) : null}

                  <div
                    className="admin-product-image-fallback"
                    style={{
                      display: productImageUrl ? "none" : "flex",
                    }}
                  >
                    <FiPackage />
                  </div>

                  <div className="admin-product-badges">
                    {!product.isActive && (
                      <span className="inactive">Inactive</span>
                    )}

                    {product.featured && (
                      <span className="featured">
                        <FiStar />
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* BODY */}

                <div className="admin-product-body">
                  <div className="admin-product-category">
                    <FiTag />

                    {product.category}
                  </div>

                  <h3>{product.name}</h3>

                  {product.brand && (
                    <p className="admin-product-brand">
                      {product.brand}
                    </p>
                  )}

                  {product.description && (
                    <p className="admin-product-description">
                      {product.description}
                    </p>
                  )}

                  {/* PRICE */}

                  <div className="admin-product-price">
                    {pricing.hasDiscount ? (
                      <>
                        <strong>
                          ₹{pricing.discount.toLocaleString("en-IN")}
                        </strong>

                        <span>
                          ₹{pricing.price.toLocaleString("en-IN")}
                        </span>
                      </>
                    ) : (
                      <strong>
                        ₹{pricing.price.toLocaleString("en-IN")}
                      </strong>
                    )}
                  </div>

                  {/* STOCK */}

                  <div className="admin-product-stock-row">
                    <span
                      className={`admin-product-stock ${stockStatus.className}`}
                    >
                      {stockStatus.text}
                    </span>

                    {product.sku && (
                      <span className="admin-product-sku">
                        SKU: {product.sku}
                      </span>
                    )}
                  </div>
                </div>

                {/* ACTIONS */}

                <div className="admin-product-actions">
                  <button
                    type="button"
                    className="admin-product-edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    <FiEdit2 />
                    Edit
                  </button>

                  <button
                    type="button"
                    className={`admin-product-status-btn ${
                      product.isActive ? "deactivate" : "activate"
                    }`}
                    onClick={() => handleToggleStatus(product)}
                  >
                    {product.isActive ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    type="button"
                    className={`admin-product-feature-btn ${
                      product.featured ? "selected" : ""
                    }`}
                    onClick={() => handleToggleFeatured(product)}
                    title={
                      product.featured
                        ? "Remove featured"
                        : "Make featured"
                    }
                  >
                    <FiStar />
                  </button>

                  <button
                    type="button"
                    className="admin-product-delete-btn"
                    onClick={() => handleDelete(product)}
                    title="Delete product"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================
          ADD / EDIT MODAL
      ====================================================== */}

      {showModal && (
        <div
          className="admin-products-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !saving) {
              closeModal();
            }
          }}
        >
          <div className="admin-products-modal">
            {/* HEADER */}

            <div className="admin-products-modal-header">
              <div>
                <h2>
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h2>

                <p>
                  {editingProduct
                    ? "Update product information"
                    : "Add a new product to your store"}
                </p>
              </div>

              <button
                type="button"
                className="admin-products-modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <FiX />
              </button>
            </div>

            {/* FORM */}

            <form
              className="admin-products-form"
              onSubmit={handleSubmit}
            >
              {/* BASIC INFORMATION */}

              <div className="admin-products-section">
                <h3>Product Information</h3>

                <div className="admin-products-form-grid">
                  <div className="admin-products-field">
                    <label>Product Name *</label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. 5kW Solar Panel"
                      required
                    />
                  </div>

                  <div className="admin-products-field">
                    <label>Category *</label>

                    <input
                      type="text"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      placeholder="e.g. Solar Panels"
                      required
                    />
                  </div>

                  <div className="admin-products-field">
                    <label>Brand</label>

                    <input
                      type="text"
                      name="brand"
                      value={form.brand}
                      onChange={handleChange}
                      placeholder="e.g. Tata Power"
                    />
                  </div>

                  <div className="admin-products-field">
                    <label>SKU</label>

                    <input
                      type="text"
                      name="sku"
                      value={form.sku}
                      onChange={handleChange}
                      placeholder="e.g. SP-5000-001"
                    />
                  </div>
                </div>

                <div className="admin-products-field">
                  <label>Description</label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the product..."
                    rows="4"
                  />
                </div>
              </div>

              {/* PRICING */}

              <div className="admin-products-section">
                <h3>Pricing & Stock</h3>

                <div className="admin-products-form-grid">
                  <div className="admin-products-field">
                    <label>Price *</label>

                    <div className="admin-products-input-icon">
                      <FiDollarSign />

                      <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div className="admin-products-field">
                    <label>Discount Price</label>

                    <div className="admin-products-input-icon">
                      <FiDollarSign />

                      <input
                        type="number"
                        name="discountPrice"
                        value={form.discountPrice}
                        onChange={handleChange}
                        placeholder="Optional"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="admin-products-field">
                    <label>Stock Quantity</label>

                    <div className="admin-products-input-icon">
                      <FiBox />

                      <input
                        type="number"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* IMAGE */}

              <div className="admin-products-section">
                <h3>Product Image</h3>

                <div className="admin-products-field">
                  <label>Upload from your computer</label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                  />

                  {imagePreview && (
                    <div className="admin-products-image-preview">
                      <img
                        key={imagePreview}
                        src={imagePreview}
                        alt="Product preview"
                        onError={(e) => {
                          console.error(
                            "Failed to load preview image:",
                            e.currentTarget.src
                          );

                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {imagePreview && (
                    <button
                      type="button"
                      className="admin-products-remove-image"
                      onClick={handleRemoveImage}
                    >
                      <FiTrash2 />
                      Remove image
                    </button>
                  )}

                  {removeImage && !imagePreview && (
                    <small>
                      The current image will be removed when you
                      save.
                    </small>
                  )}

                  {imageFile && (
                    <small>
                      Selected: <strong>{imageFile.name}</strong>
                    </small>
                  )}

                  <small>
                    <FiUpload /> JPG, JPEG, PNG or WEBP. Maximum
                    size: 5MB.
                  </small>
                </div>
              </div>

              {/* SPECIFICATIONS */}

              <div className="admin-products-section">
                <h3>Specifications</h3>

                <div className="admin-products-field">
                  <label>Product Specifications</label>

                  <textarea
                    name="specifications"
                    value={form.specifications}
                    onChange={handleChange}
                    placeholder={
                      "Power: 5kW\nEfficiency: 21%\nWarranty: 25 Years"
                    }
                    rows="6"
                  />

                  <small>
                    Add one specification per line using:
                    <br />
                    <strong>Name: Value</strong>
                  </small>
                </div>
              </div>

              {/* OPTIONS */}

              <div className="admin-products-options">
                <label className="admin-products-check">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                  />

                  <span>
                    <FiStar />
                    Featured Product
                  </span>
                </label>

                <label className="admin-products-check">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                  />

                  <span>
                    <FiCheck />
                    Active Product
                  </span>
                </label>
              </div>

              {/* ACTIONS */}

              <div className="admin-products-modal-actions">
                <button
                  type="button"
                  className="admin-products-cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-products-save-btn"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="admin-products-btn-loader"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCheck />

                      {editingProduct
                        ? "Update Product"
                        : "Add Product"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;