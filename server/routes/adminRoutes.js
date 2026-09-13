import express from "express";

import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
} from "../controllers/adminController.js";

import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

// ==========================================
// Admin Authentication & Authorization
// ==========================================

router.use(protect, admin);

// ==========================================
// Dashboard
// ==========================================

router.get("/stats", getDashboardStats);

// ==========================================
// Users
// ==========================================

router.get("/users", getAllUsers);

// ==========================================
// Orders
// ==========================================

router.get("/orders", getAllOrders);

router.put("/orders/:id/status", updateOrderStatus);

export default router;
