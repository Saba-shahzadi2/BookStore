import express from "express";

import {
  getAllContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage,
} from "../controllers/adminContactController.js";

import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

// ============================================================
// Admin Authentication
// ============================================================

// Every contact-management route requires:
// 1. Logged-in user
// 2. Admin role
router.use(protect, admin);

// ============================================================
// Contact Messages
// ============================================================

// GET /api/admin/messages
// Get all messages with search, status filter and pagination
router.get("/", getAllContactMessages);

// GET /api/admin/messages/:id
// Get a single contact message
router.get("/:id", getContactMessageById);

// PUT /api/admin/messages/:id/status
// Update message status: new | read | replied
router.put("/:id/status", updateContactMessageStatus);

// DELETE /api/admin/messages/:id
// Delete a contact message
router.delete("/:id", deleteContactMessage);

export default router;
