import express from "express";

import {
  getAllProducts,
  getPublicProducts,
  getPublicProduct,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import upload from "../middleware/productUpload.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC  (must stay above "/:id")
|--------------------------------------------------------------------------
*/

router.get("/public", getPublicProducts);
router.get("/public/:id", getPublicProduct);

/*
|--------------------------------------------------------------------------
| ADMIN
| Order matters: adminAuth -> multer -> controller
| (auth first so unauthenticated users can't write files to disk)
|--------------------------------------------------------------------------
*/

router.get("/", adminAuth, getAllProducts);
router.get("/:id", adminAuth, getProduct);

router.post("/", adminAuth, upload.single("image"), createProduct);
router.put("/:id", adminAuth, upload.single("image"), updateProduct);

router.delete("/:id", adminAuth, deleteProduct);

export default router;