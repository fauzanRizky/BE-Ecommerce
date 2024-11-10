import express from "express";
import {
  protectedMiddleware,
  ownerMiddleware,
} from "../middlewares/authMiddleware.js";
import {
  createOrder,
  showAllOrder,
  detailOrder,
  currentUserOrder,
  callbackPayment,
} from "../controllers/orderController.js";

const router = express.Router();

// post api/v1/order
// Bisa diakses oleh semua user
router.post("/", protectedMiddleware, createOrder);

// post api/v1/order
// Hanya bisa diakses oleh owner
router.get("/", protectedMiddleware, ownerMiddleware, showAllOrder);

// post api/v1/order
// Hanya bisa diakses oleh owner
router.get("/:id", protectedMiddleware, ownerMiddleware, detailOrder);

// post api/v1/order
// Hanya bisa diakses oleh semua user yang sedang login
router.get("/current/user", protectedMiddleware, currentUserOrder);

// post api/v1/order/callback/midtrans
router.post("/callback/midtrans", callbackPayment);

export default router;
