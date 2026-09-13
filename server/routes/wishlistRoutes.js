import express from "express";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";

import protect from "../middleware/authMiddleware.js";

import {
  validateWishlistBook,
  validateWishlistBookId,
} from "../validators/wishlistValidator.js";

const router = express.Router();

// ==========================================
// Wishlist
// ==========================================

router.get("/", protect, getWishlist);

router.post("/add", protect, validateWishlistBook, addToWishlist);

router.delete(
  "/remove/:bookId",
  protect,
  validateWishlistBookId,
  removeFromWishlist,
);

router.delete("/clear", protect, clearWishlist);

export default router;
