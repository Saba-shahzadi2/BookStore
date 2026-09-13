import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    // ==========================================
    // Basic Book Information
    // ==========================================

    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },

    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      minlength: [2, "Author must be at least 2 characters"],
      maxlength: [100, "Author cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    // ==========================================
    // Pricing
    // ==========================================

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    // ==========================================
    // Category
    // ==========================================

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      minlength: [2, "Category must be at least 2 characters"],
      maxlength: [50, "Category cannot exceed 50 characters"],
      index: true,
    },

    // ==========================================
    // Cover Image
    // ==========================================

    coverImage: {
      type: String,
      default: "",
      trim: true,
      maxlength: [500, "Cover image URL cannot exceed 500 characters"],
    },

    // ==========================================
    // Inventory
    // ==========================================

    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },

    // ==========================================
    // Reviews / Rating
    // ==========================================

    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be below 0"],
      max: [5, "Rating cannot exceed 5"],
    },

    numReviews: {
      type: Number,
      default: 0,
      min: [0, "Number of reviews cannot be negative"],
    },

    // ==========================================
    // Store Controls
    // ==========================================

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // ==========================================
    // Created By
    // ==========================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// Compound Indexes
// ==========================================

// Optimizes common storefront queries such as
// active featured books sorted by newest first.
bookSchema.index({
  isActive: 1,
  isFeatured: 1,
  createdAt: -1,
});

// Optimizes active-book category filtering.
bookSchema.index({
  isActive: 1,
  category: 1,
});

// Optimizes newest active books.
bookSchema.index({
  isActive: 1,
  createdAt: -1,
});

// ==========================================
// Model
// ==========================================

const Book = mongoose.model("Book", bookSchema);

export default Book;
