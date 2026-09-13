import mongoose from "mongoose";

import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Book from "../models/Book.js";

// ==========================================
// Constants
// ==========================================

const PAYMENT_METHODS = [
  "COD",
  "EASYPAISA",
  "JAZZCASH",
  "BANK_TRANSFER",
  "CARD",
];

const MAX_ORDER_ITEM_QUANTITY = 100;

// ==========================================
// Helpers
// ==========================================

const isValidObjectId = (id) => {
  return typeof id === "string" && mongoose.Types.ObjectId.isValid(id.trim());
};

const cleanString = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

const validateShippingAddress = (shippingAddress) => {
  if (
    !shippingAddress ||
    typeof shippingAddress !== "object" ||
    Array.isArray(shippingAddress)
  ) {
    return "Complete shipping address is required";
  }

  const fullName = cleanString(shippingAddress.fullName);

  const phone = cleanString(shippingAddress.phone);

  const address = cleanString(shippingAddress.address);

  const city = cleanString(shippingAddress.city);

  const postalCode = cleanString(shippingAddress.postalCode);

  if (!fullName || !phone || !address || !city || !postalCode) {
    return "Complete shipping address is required";
  }

  if (fullName.length < 2 || fullName.length > 100) {
    return "Full name must be between 2 and 100 characters";
  }

  if (phone.length < 7 || phone.length > 20) {
    return "Phone number must be between 7 and 20 characters";
  }

  if (address.length < 5 || address.length > 300) {
    return "Address must be between 5 and 300 characters";
  }

  if (city.length < 2 || city.length > 100) {
    return "City must be between 2 and 100 characters";
  }

  if (postalCode.length < 3 || postalCode.length > 20) {
    return "Postal code must be between 3 and 20 characters";
  }

  return null;
};

const handleValidationError = (error, res) => {
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((item) => item.message);

    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  return null;
};

// ==========================================
// Create Order / Checkout
// ==========================================

const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      shippingAddress,
      paymentMethod = "COD",
      paymentReference = "",
    } = req.body || {};

    // ==========================================
    // Validate Shipping Address
    // ==========================================

    const shippingError = validateShippingAddress(shippingAddress);

    if (shippingError) {
      return res.status(400).json({
        success: false,
        message: shippingError,
      });
    }

    // ==========================================
    // Validate Payment Method
    // ==========================================

    if (
      typeof paymentMethod !== "string" ||
      !PAYMENT_METHODS.includes(paymentMethod)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // ==========================================
    // Validate Payment Reference
    // ==========================================

    if (
      paymentReference !== undefined &&
      paymentReference !== null &&
      typeof paymentReference !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment reference",
      });
    }

    const cleanPaymentReference = cleanString(paymentReference);

    if (cleanPaymentReference.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Payment reference cannot exceed 100 characters",
      });
    }

    if (paymentMethod === "COD" && cleanPaymentReference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is not required for cash on delivery",
      });
    }

    // ==========================================
    // Start Transaction
    // ==========================================

    session.startTransaction();

    // ==========================================
    // Get User Cart
    // ==========================================

    const cart = await Cart.findOne({
      user: req.user._id,
    }).session(session);

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // ==========================================
    // Prepare Order
    // ==========================================

    const orderItems = [];

    let subtotal = 0;

    // ==========================================
    // Process Cart Items
    // ==========================================

    for (const item of cart.items) {
      // ------------------------------------------
      // Validate Cart Item
      // ------------------------------------------

      if (!item.book || !isValidObjectId(item.book.toString())) {
        throw new Error("Invalid book in cart");
      }

      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > MAX_ORDER_ITEM_QUANTITY
      ) {
        throw new Error("Invalid quantity in cart");
      }

      // ------------------------------------------
      // Atomically Deduct Stock
      // ------------------------------------------

      const book = await Book.findOneAndUpdate(
        {
          _id: item.book,
          isActive: true,
          stock: {
            $gte: item.quantity,
          },
        },
        {
          $inc: {
            stock: -item.quantity,
          },
        },
        {
          new: true,
          session,
        },
      );

      // ------------------------------------------
      // Book / Stock Failure
      // ------------------------------------------

      if (!book) {
        const existingBook = await Book.findById(item.book)
          .select("title isActive stock")
          .session(session);

        if (!existingBook) {
          throw new Error("One of the books in your cart no longer exists");
        }

        if (!existingBook.isActive) {
          throw new Error(`"${existingBook.title}" is no longer available`);
        }

        throw new Error(`"${existingBook.title}" does not have enough stock`);
      }

      // ------------------------------------------
      // Server-side Price Calculation
      // ------------------------------------------

      if (
        typeof book.price !== "number" ||
        !Number.isFinite(book.price) ||
        book.price < 0
      ) {
        throw new Error("Invalid book price");
      }

      const itemTotal = book.price * item.quantity;

      if (!Number.isFinite(itemTotal) || itemTotal < 0) {
        throw new Error("Unable to calculate item price");
      }

      subtotal += itemTotal;

      // ------------------------------------------
      // Snapshot Order Item
      // ------------------------------------------

      orderItems.push({
        book: book._id,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage || "",
        quantity: item.quantity,
        price: book.price,
      });
    }

    // ==========================================
    // Calculate Totals
    // ==========================================

    subtotal = Number(subtotal.toFixed(2));

    const shippingFee = subtotal >= 50 ? 0 : 5;

    const total = Number((subtotal + shippingFee).toFixed(2));

    if (
      !Number.isFinite(subtotal) ||
      !Number.isFinite(shippingFee) ||
      !Number.isFinite(total) ||
      subtotal < 0 ||
      shippingFee < 0 ||
      total < 0
    ) {
      throw new Error("Unable to calculate order total");
    }

    // ==========================================
    // Initial Payment Status
    // ==========================================

    const paymentStatus = "pending";

    // ==========================================
    // Create Order
    // ==========================================

    const [order] = await Order.create(
      [
        {
          user: req.user._id,

          items: orderItems,

          shippingAddress: {
            fullName: cleanString(shippingAddress.fullName),

            phone: cleanString(shippingAddress.phone),

            address: cleanString(shippingAddress.address),

            city: cleanString(shippingAddress.city),

            postalCode: cleanString(shippingAddress.postalCode),
          },

          paymentMethod,

          paymentStatus,

          paymentReference:
            paymentMethod === "COD" ? "" : cleanPaymentReference,

          orderStatus: "pending",

          subtotal,

          shippingFee,

          total,
        },
      ],
      {
        session,
      },
    );

    // ==========================================
    // Clear Cart
    // ==========================================

    cart.items = [];

    await cart.save({
      session,
    });

    // ==========================================
    // Commit Transaction
    // ==========================================

    await session.commitTransaction();

    // ==========================================
    // Success Response
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    // ==========================================
    // Abort Transaction
    // ==========================================

    if (session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error("Transaction Abort Error:", abortError);
      }
    }

    console.error("Create Order Error:", error);

    // ==========================================
    // Validation Errors
    // ==========================================

    const handled = handleValidationError(error, res);

    if (handled) {
      return;
    }

    // ==========================================
    // Safe Production Error
    // ==========================================

    return res.status(500).json({
      success: false,
      message: "Unable to place order. Please try again.",
    });
  } finally {
    await session.endSession();
  }
};

// ==========================================
// Get My Orders
// ==========================================

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
    });
  }
};

// ==========================================
// Get Single Order
// ==========================================

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: id,
      user: req.user._id,
    }).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);

    const handled = handleValidationError(error, res);

    if (handled) {
      return;
    }

    return res.status(500).json({
      success: false,
      message: "Server error while fetching order",
    });
  }
};

// ==========================================
// Cancel Order
// ==========================================

const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    // ==========================================
    // Start Transaction
    // ==========================================

    session.startTransaction();

    // ==========================================
    // Get User's Order
    // ==========================================

    const order = await Order.findOne({
      _id: id,
      user: req.user._id,
    }).session(session);

    if (!order) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ==========================================
    // Cancellation Eligibility
    // ==========================================

    if (!["pending", "confirmed"].includes(order.orderStatus)) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "This order can no longer be cancelled",
      });
    }

    // ==========================================
    // Restore Stock
    // ==========================================

    for (const item of order.items) {
      if (
        !item.book ||
        !isValidObjectId(item.book.toString()) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > MAX_ORDER_ITEM_QUANTITY
      ) {
        throw new Error("Invalid item data in order");
      }

      const book = await Book.findByIdAndUpdate(
        item.book,
        {
          $inc: {
            stock: item.quantity,
          },
        },
        {
          new: true,
          session,
        },
      );

      if (!book) {
        throw new Error("Unable to restore stock for an order item");
      }
    }

    // ==========================================
    // Update Order Status
    // ==========================================

    order.orderStatus = "cancelled";

    await order.save({
      session,
    });

    // ==========================================
    // Commit Transaction
    // ==========================================

    await session.commitTransaction();

    // ==========================================
    // Success Response
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    // ==========================================
    // Abort Transaction
    // ==========================================

    if (session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error("Transaction Abort Error:", abortError);
      }
    }

    console.error("Cancel Order Error:", error);

    const handled = handleValidationError(error, res);

    if (handled) {
      return;
    }

    return res.status(500).json({
      success: false,
      message: "Unable to cancel order. Please try again.",
    });
  } finally {
    await session.endSession();
  }
};

// ==========================================
// Exports
// ==========================================

export { createOrder, getMyOrders, getOrderById, cancelOrder };
