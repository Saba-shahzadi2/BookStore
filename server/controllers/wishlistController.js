import mongoose from "mongoose";

import Wishlist from "../models/Wishlist.js";
import Book from "../models/Book.js";

// ==========================================
// Helpers
// ==========================================

const isValidObjectId = (id) => {
  return typeof id === "string" && mongoose.Types.ObjectId.isValid(id.trim());
};

const cleanBookId = (id) => {
  return typeof id === "string" ? id.trim() : "";
};

const handleWishlistError = (error, res) => {
  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Invalid wishlist data",
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
      message: "Wishlist already exists for this user",
    });
  }

  return null;
};

// ==========================================
// Get Wishlist
// ==========================================

const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    }).populate("books");

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        books: [],
      });
    }

    return res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error("Get Wishlist Error:", error);

    const handled = handleWishlistError(error, res);

    if (handled) return;

    return res.status(500).json({
      success: false,
      message: "Server error while fetching wishlist",
    });
  }
};

// ==========================================
// Add Book to Wishlist
// ==========================================

const addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body || {};

    // ------------------------------------------
    // Book ID Validation
    // ------------------------------------------

    const cleanId = cleanBookId(bookId);

    if (!cleanId) {
      return res.status(400).json({
        success: false,
        message: "Book ID is required",
      });
    }

    if (!isValidObjectId(cleanId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    // ------------------------------------------
    // Check Active Book
    // ------------------------------------------

    const book = await Book.findOne({
      _id: cleanId,
      isActive: true,
    }).select("_id");

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found or is no longer available",
      });
    }

    // ------------------------------------------
    // Find or Create Wishlist
    // ------------------------------------------

    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user._id,
        books: [],
      });
    }

    // ------------------------------------------
    // Prevent Duplicate Book
    // ------------------------------------------

    const alreadyExists = wishlist.books.some(
      (id) => id.toString() === cleanId,
    );

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Book is already in wishlist",
      });
    }

    // ------------------------------------------
    // Add Book
    // ------------------------------------------

    wishlist.books.addToSet(cleanId);

    await wishlist.save();

    await wishlist.populate("books");

    return res.status(200).json({
      success: true,
      message: "Book added to wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Add Wishlist Error:", error);

    const handled = handleWishlistError(error, res);

    if (handled) return;

    return res.status(500).json({
      success: false,
      message: "Server error while adding book to wishlist",
    });
  }
};

// ==========================================
// Remove Book from Wishlist
// ==========================================

const removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;

    // ------------------------------------------
    // Book ID Validation
    // ------------------------------------------

    const cleanId = cleanBookId(bookId);

    if (!isValidObjectId(cleanId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    // ------------------------------------------
    // Find Wishlist
    // ------------------------------------------

    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    // ------------------------------------------
    // Check Book
    // ------------------------------------------

    const bookExists = wishlist.books.some((id) => id.toString() === cleanId);

    if (!bookExists) {
      return res.status(404).json({
        success: false,
        message: "Book is not in wishlist",
      });
    }

    // ------------------------------------------
    // Remove Book
    // ------------------------------------------

    wishlist.books = wishlist.books.filter((id) => id.toString() !== cleanId);

    await wishlist.save();

    await wishlist.populate("books");

    return res.status(200).json({
      success: true,
      message: "Book removed from wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Remove Wishlist Error:", error);

    const handled = handleWishlistError(error, res);

    if (handled) return;

    return res.status(500).json({
      success: false,
      message: "Server error while removing book from wishlist",
    });
  }
};

// ==========================================
// Clear Wishlist
// ==========================================

const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    // ------------------------------------------
    // Wishlist Does Not Exist
    // ------------------------------------------

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        message: "Wishlist is already empty",
        wishlist: {
          user: req.user._id,
          books: [],
        },
      });
    }

    // ------------------------------------------
    // Clear Books
    // ------------------------------------------

    wishlist.books = [];

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
      wishlist,
    });
  } catch (error) {
    console.error("Clear Wishlist Error:", error);

    const handled = handleWishlistError(error, res);

    if (handled) return;

    return res.status(500).json({
      success: false,
      message: "Server error while clearing wishlist",
    });
  }
};

// ==========================================
// Exports
// ==========================================

export { getWishlist, addToWishlist, removeFromWishlist, clearWishlist };
