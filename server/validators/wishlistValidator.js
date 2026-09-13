import mongoose from "mongoose";

// ==========================================
// Helpers
// ==========================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ==========================================
// Add To Wishlist Validator
// ==========================================

const validateWishlistBook = (req, res, next) => {
  const { bookId } = req.body || {};

  if (typeof bookId !== "string" || !bookId.trim()) {
    return res.status(400).json({
      success: false,
      message: "Book ID is required",
    });
  }

  if (!isValidObjectId(bookId.trim())) {
    return res.status(400).json({
      success: false,
      message: "Invalid book ID",
    });
  }

  next();
};

// ==========================================
// Remove From Wishlist Validator
// ==========================================

const validateWishlistBookId = (req, res, next) => {
  const { bookId } = req.params;

  if (typeof bookId !== "string" || !bookId.trim()) {
    return res.status(400).json({
      success: false,
      message: "Book ID is required",
    });
  }

  if (!isValidObjectId(bookId.trim())) {
    return res.status(400).json({
      success: false,
      message: "Invalid book ID",
    });
  }

  next();
};

// ==========================================
// Exports
// ==========================================

export { validateWishlistBook, validateWishlistBookId };
