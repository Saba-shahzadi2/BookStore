import mongoose from "mongoose";

// ==========================================
// Order Item Schema
// ==========================================

const orderItemSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },

    author: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Author must be at least 2 characters"],
      maxlength: [100, "Author cannot exceed 100 characters"],
    },

    coverImage: {
      type: String,
      default: "",
      trim: true,
      maxlength: [500, "Cover image URL cannot exceed 500 characters"],
    },

    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
      max: [100, "Quantity cannot exceed 100"],
    },

    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
  },
  {
    _id: false,
  },
);

// ==========================================
// Order Schema
// ==========================================

const orderSchema = new mongoose.Schema(
  {
    // ==========================================
    // User
    // ==========================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ==========================================
    // Order Items
    // ==========================================

    items: {
      type: [orderItemSchema],
      required: true,

      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,

        message: "Order must contain at least one item",
      },
    },

    // ==========================================
    // Shipping Address
    // ==========================================

    shippingAddress: {
      fullName: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, "Full name must be at least 2 characters"],
        maxlength: [100, "Name cannot exceed 100 characters"],
      },

      phone: {
        type: String,
        required: true,
        trim: true,
        minlength: [7, "Phone number is too short"],
        maxlength: [20, "Phone number cannot exceed 20 characters"],
      },

      address: {
        type: String,
        required: true,
        trim: true,
        minlength: [5, "Address must be at least 5 characters"],
        maxlength: [300, "Address cannot exceed 300 characters"],
      },

      city: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, "City must be at least 2 characters"],
        maxlength: [100, "City cannot exceed 100 characters"],
      },

      postalCode: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, "Postal code is too short"],
        maxlength: [20, "Postal code cannot exceed 20 characters"],
      },
    },

    // ==========================================
    // Payment
    // ==========================================

    paymentMethod: {
      type: String,
      enum: ["COD", "EASYPAISA", "JAZZCASH", "BANK_TRANSFER", "CARD"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paymentReference: {
      type: String,
      trim: true,
      maxlength: [200, "Payment reference cannot exceed 200 characters"],
      default: "",
    },

    // ==========================================
    // Order Status
    // ==========================================

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    // ==========================================
    // Pricing
    // ==========================================

    subtotal: {
      type: Number,
      required: true,
      min: [0, "Subtotal cannot be negative"],
    },

    shippingFee: {
      type: Number,
      default: 0,
      min: [0, "Shipping fee cannot be negative"],
    },

    total: {
      type: Number,
      required: true,
      min: [0, "Total cannot be negative"],
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// Indexes
// ==========================================

orderSchema.index({
  user: 1,
  createdAt: -1,
});

orderSchema.index({
  orderStatus: 1,
  createdAt: -1,
});

orderSchema.index({
  paymentStatus: 1,
  createdAt: -1,
});

// ==========================================
// Model
// ==========================================

const Order = mongoose.model("Order", orderSchema);

export default Order;
