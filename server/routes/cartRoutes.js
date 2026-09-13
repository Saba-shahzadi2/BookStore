import express from "express";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

import protect from "../middleware/authMiddleware.js";

import {
  validateAddToCart,
  validateUpdateCartItem,
  validateRemoveCartItem,
} from "../validators/cartValidator.js";

const router = express.Router();

// ==========================================
// Cart
// ==========================================

router.get("/", protect, getCart);

router.post("/add", protect, validateAddToCart, addToCart);

router.put("/update/:bookId", protect, validateUpdateCartItem, updateCartItem);

router.delete(
  "/remove/:bookId",
  protect,
  validateRemoveCartItem,
  removeFromCart,
);

router.delete("/clear", protect, clearCart);

export default router;
