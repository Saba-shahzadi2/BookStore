import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from "../controllers/orderController.js";

import protect from "../middleware/authMiddleware.js";

import {
  validateCreateOrder,
  validateOrderId,
} from "../validators/orderValidator.js";

const router = express.Router();

// ==========================================
// Create Order
// ==========================================

router.post("/", protect, validateCreateOrder, createOrder);

// ==========================================
// User Orders
// ==========================================

router.get("/my-orders", protect, getMyOrders);

router.get("/:id", protect, validateOrderId, getOrderById);

router.put("/:id/cancel", protect, validateOrderId, cancelOrder);

// ==========================================
// Export
// ==========================================

export default router;
