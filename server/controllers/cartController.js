import mongoose from "mongoose";

import Cart from "../models/Cart.js";
import Book from "../models/Book.js";

// ==========================================
// Constants
// ==========================================

const MAX_CART_QUANTITY = 100;

// ==========================================
// Helpers
// ==========================================

const isValidObjectId = (id) => {
  return typeof id === "string" && mongoose.Types.ObjectId.isValid(id.trim());
};

const parseQuantity = (quantity) => {
  if (quantity === undefined || quantity === null || quantity === "") {
    return null;
  }

  if (typeof quantity !== "number" || !Number.isInteger(quantity)) {
    return null;
  }

  if (quantity < 1 || quantity > MAX_CART_QUANTITY) {
    return null;
  }

  return quantity;
};

const handleCartError = (error, res) => {
  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Invalid cart data",
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid book ID",
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Cart already exists for this user",
    });
  }

  return null;
};

// ==========================================
// Get Cart
// ==========================================

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.book");

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get Cart Error:", error);

    const handled = handleCartError(error, res);

    if (handled) {
      return;
    }

    return res.status(500).json({
      success: false,
      message: "Server error while fetching cart",
    });
  }
};

// ==========================================
// Add To Cart
// ==========================================

const addToCart = async (req, res) => {
  try {
    const { bookId, quantity = 1 } = req.body || {};

    // ==========================================
    // Book ID Validation
    // ==========================================

    if (typeof bookId !== "string" || !bookId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Book ID is required",
      });
    }

    const cleanBookId = bookId.trim();

    if (!isValidObjectId(cleanBookId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    // ==========================================
    // Quantity Validation
    // ==========================================

    const parsedQuantity = parseQuantity(quantity);

    if (parsedQuantity === null) {
      return res.status(400).json({
        success: false,
        message: `Quantity must be an integer between 1 and ${MAX_CART_QUANTITY}`,
      });
    }

    // ==========================================
    // Find Active Book
    // ==========================================

    const book = await Book.findOne({
      _id: cleanBookId,
      isActive: true,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found or is no longer available",
      });
    }

    // ==========================================
    // Stock Validation
    // ==========================================

    if (book.stock < parsedQuantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    // ==========================================
    // Find Or Create Cart
    // ==========================================

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    // ==========================================
    // Existing Cart Item
    // ==========================================

    const existingItem = cart.items.find(
      (item) => item.book && item.book.toString() === cleanBookId,
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + parsedQuantity;

      if (newQuantity > MAX_CART_QUANTITY) {
        return res.status(400).json({
          success: false,
          message: `Cart quantity cannot exceed ${MAX_CART_QUANTITY}`,
        });
      }

      if (newQuantity > book.stock) {
        return res.status(400).json({
          success: false,
          message: "Requested quantity exceeds available stock",
        });
      }

      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        book: cleanBookId,
        quantity: parsedQuantity,
      });
    }

    // ==========================================
    // Save And Populate
    // ==========================================

    await cart.save();

    await cart.populate("items.book");

    return res.status(200).json({
      success: true,
      message: "Book added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add Cart Error:", error);

    const handled = handleCartError(error, res);

    if (handled) {
      return;
    }

    return res.status(500).json({
      success: false,
      message: "Server error while adding book to cart",
    });
  }
};

// ==========================================
// Update Cart Item
// ==========================================

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body || {};

    const { bookId } = req.params;

    // ==========================================
    // Book ID Validation
    // ==========================================

    if (!isValidObjectId(bookId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const cleanBookId = bookId.trim();

    // ==========================================
    // Quantity Validation
    // ==========================================

    const parsedQuantity = parseQuantity(quantity);

    if (parsedQuantity === null) {
      return res.status(400).json({
        success: false,
        message: `Quantity must be an integer between 1 and ${MAX_CART_QUANTITY}`,
      });
    }

    // ==========================================
    // Find Active Book
    // ==========================================

    const book = await Book.findOne({
      _id: cleanBookId,
      isActive: true,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found or is no longer available",
      });
    }

    // ==========================================
    // Stock Validation
    // ==========================================

    if (parsedQuantity > book.stock) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock",
      });
    }

    // ==========================================
    // Find Cart
    // ==========================================

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // ==========================================
    // Find Cart Item
    // ==========================================

    const item = cart.items.find(
      (cartItem) => cartItem.book && cartItem.book.toString() === cleanBookId,
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Book is not in cart",
      });
    }

    // ==========================================
    // Update Quantity
    // ==========================================

    item.quantity = parsedQuantity;

    // ==========================================
    // Save And Populate
    // ==========================================

    await cart.save();

    await cart.populate("items.book");

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Update Cart Error:", error);

    const handled = handleCartError(error, res);

    if (handled) {
      return;
    }

    return res.status(500).json({
      success: false,
      message: "Server error while updating cart",
    });
  }
};

// ==========================================
// Remove From Cart
// ==========================================

const removeFromCart = async (req, res) => {
  try {
    const { bookId } = req.params;

    // ==========================================
    // Book ID Validation
    // ==========================================

    if (!isValidObjectId(bookId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const cleanBookId = bookId.trim();

    // ==========================================
    // Find Cart
    // ==========================================

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // ==========================================
    // Check Item
    // ==========================================

    const itemExists = cart.items.some(
      (item) => item.book && item.book.toString() === cleanBookId,
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Book is not in cart",
      });
    }

    // ==========================================
    // Remove Item
    // ==========================================

    cart.items = cart.items.filter(
      (item) => !item.book || item.book.toString() !== cleanBookId,
    );

    await cart.save();

    await cart.populate("items.book");

    return res.status(200).json({
      success: true,
      message: "Book removed from cart",
      cart,
    });
  } catch (error) {
    console.error("Remove Cart Error:", error);

    const handled = handleCartError(error, res);

    if (handled) {
      return;
    }

    return res.status(500).json({
      success: false,
      message: "Server error while removing book from cart",
    });
  }
};

// ==========================================
// Clear Cart
// ==========================================

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    // ==========================================
    // Cart Does Not Exist
    // ==========================================

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is already empty",
        cart: {
          user: req.user._id,
          items: [],
        },
      });
    }

    // ==========================================
    // Clear Items
    // ==========================================

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error("Clear Cart Error:", error);

    const handled = handleCartError(error, res);

    if (handled) {
      return;
    }

    return res.status(500).json({
      success: false,
      message: "Server error while clearing cart",
    });
  }
};

// ==========================================
// Exports
// ==========================================

export { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
