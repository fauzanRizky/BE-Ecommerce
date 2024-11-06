import express from "express";
import {
  protectedMiddleware,
  ownerMiddleware,
} from "../middlewares/authMiddleware.js";
import {
  createProduct,
  showAllProduct,
  detailProduct,
  updateProduct,
  deleteProduct,
  fileUploadProduct,
} from "../controllers/productController.js";
import { upload } from "../utils/uploadFileHandler.js";

const router = express.Router();

/** Show All Product */
// get /api/v1/product
router.get("/", showAllProduct);

/** Create New Product */
// post /api/v1/product
// Middleware Owner
router.post("/", protectedMiddleware, ownerMiddleware, createProduct);

/** Detail Product */
// get /api/v1/product/:id
router.get("/:id", detailProduct);

/** Update Product */
// put /api/v1/product/:id
// Middleware Owner
router.put("/:id", protectedMiddleware, ownerMiddleware, updateProduct);

/** Delete Product */
// delete /api/v1/product/:id
// Middleware Owner
router.delete("/:id", protectedMiddleware, ownerMiddleware, deleteProduct);

/** File Upload Product */
// post /api/v1/product/file-upload
// Middleware Owner
router.post(
  "/file-upload",
  protectedMiddleware,
  ownerMiddleware,
  upload.single("image"),
  fileUploadProduct
);

export default router;
