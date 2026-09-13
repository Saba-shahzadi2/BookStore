import express from "express";

import {
  getBooks,
  getBookById,
  getAdminBooks,
  createBook,
  updateBook,
  deleteBook,
  restoreBook,
} from "../controllers/bookController.js";

import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

import {
  validateCreateBook,
  validateUpdateBook,
} from "../validators/bookValidator.js";

const router = express.Router();

// ==========================================
// Public Routes
// ==========================================

router.get("/", getBooks);

// ==========================================
// Admin Routes
// ==========================================

router.get("/admin/all", protect, admin, getAdminBooks);

router.put("/admin/:id/restore", protect, admin, restoreBook);

// ==========================================
// Public Single Book
// ==========================================

router.get("/:id", getBookById);

// ==========================================
// Admin Book Management
// ==========================================

router.post("/", protect, admin, validateCreateBook, createBook);

router.put("/:id", protect, admin, validateUpdateBook, updateBook);

router.delete("/:id", protect, admin, deleteBook);

export default router;
