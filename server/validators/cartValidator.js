import mongoose from "mongoose";

// ==========================================
// Helpers
// ==========================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ==========================================
// Add To Cart Validator
// ==========================================

const validateAddToCart = (req, res, next) => {
  const { bookId, quantity } = req.body || {};

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

  if (quantity === undefined || quantity === null || quantity === "") {
    return res.status(400).json({
      success: false,
      message: "Quantity is required",
    });
  }

  if (
    typeof quantity !== "number" ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 100
  ) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be an integer between 1 and 100",
    });
  }

  next();
};

// ==========================================
// Update Cart Item Validator
// ==========================================

const validateUpdateCartItem = (req, res, next) => {
  const { bookId } = req.params;
  const { quantity } = req.body || {};

  if (
    typeof bookId !== "string" ||
    !bookId.trim() ||
    !isValidObjectId(bookId.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid book ID",
    });
  }

  if (quantity === undefined || quantity === null || quantity === "") {
    return res.status(400).json({
      success: false,
      message: "Quantity is required",
    });
  }

  if (
    typeof quantity !== "number" ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 100
  ) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be an integer between 1 and 100",
    });
  }

  next();
};

// ==========================================
// Remove Cart Item Validator
// ==========================================

const validateRemoveCartItem = (req, res, next) => {
  const { bookId } = req.params;

  if (
    typeof bookId !== "string" ||
    !bookId.trim() ||
    !isValidObjectId(bookId.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid book ID",
    });
  }

  next();
};

export { validateAddToCart, validateUpdateCartItem, validateRemoveCartItem };
