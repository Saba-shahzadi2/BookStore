import mongoose from "mongoose";
import User from "../models/User.js";
import Book from "../models/Book.js";
import Order from "../models/Order.js";
import Contact from "../models/Contact.js";

// ============================================================
// Constants
// ============================================================

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const MAX_PAGE = 100000;
const MAX_LIMIT = 100;
const MAX_SEARCH_LENGTH = 100;

// ============================================================
// Helpers
// ============================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getPagination = (query, defaultLimit = 10) => {
  const parsedPage = Number.parseInt(query.page, 10);
  const parsedLimit = Number.parseInt(query.limit, 10);

  const page =
    Number.isInteger(parsedPage) && parsedPage > 0
      ? Math.min(parsedPage, MAX_PAGE)
      : 1;

  const limit =
    Number.isInteger(parsedLimit) && parsedLimit > 0
      ? Math.min(parsedLimit, MAX_LIMIT)
      : defaultLimit;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const normalizeSearch = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, MAX_SEARCH_LENGTH);
};

// ============================================================
// Dashboard Stats
// ============================================================

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalBooks,
      totalOrders,
      revenueResult,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      lowStockBooks,
      outOfStockBooks,
      newMessages,
    ] = await Promise.all([
      // Customers only
      User.countDocuments({ role: "user" }),

      // Active books only
      Book.countDocuments({ isActive: true }),

      // All orders
      Order.countDocuments(),

      // Revenue from paid, non-cancelled orders
      Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
            orderStatus: { $ne: "cancelled" },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$total",
            },
          },
        },
      ]),

      // Pending orders
      Order.countDocuments({
        orderStatus: "pending",
      }),

      // Processing orders
      Order.countDocuments({
        orderStatus: "processing",
      }),

      // Shipped orders
      Order.countDocuments({
        orderStatus: "shipped",
      }),

      // Delivered orders
      Order.countDocuments({
        orderStatus: "delivered",
      }),

      // Cancelled orders
      Order.countDocuments({
        orderStatus: "cancelled",
      }),

      // Books with stock between 1 and 5
      Book.countDocuments({
        isActive: true,
        stock: {
          $gt: 0,
          $lte: 5,
        },
      }),

      // Books completely out of stock
      Book.countDocuments({
        isActive: true,
        stock: 0,
      }),

      // New contact messages
      Contact.countDocuments({
        status: "new",
      }),
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalBooks,
        totalOrders,
        totalRevenue,

        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,

        lowStockBooks,
        outOfStockBooks,
        newMessages,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics.",
    });
  }
};

// ============================================================
// Get All Orders
// ============================================================

const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const { page, limit, skip } = getPagination(req.query);

    const filter = {};

    // --------------------------------------------------------
    // Validate status filter
    // --------------------------------------------------------

    if (status) {
      if (!ORDER_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status.",
        });
      }

      filter.orderStatus = status;
    }

    // --------------------------------------------------------
    // Count + fetch in parallel
    // --------------------------------------------------------

    const [totalOrders, orders] = await Promise.all([
      Order.countDocuments(filter),

      Order.find(filter)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    return res.status(200).json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        totalOrders,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load orders.",
    });
  }
};

// ============================================================
// Update Order Status
// ============================================================

const updateOrderStatus = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;
    const { status } = req.body;

    // --------------------------------------------------------
    // Validate Order ID
    // --------------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    // --------------------------------------------------------
    // Validate Status
    // --------------------------------------------------------

    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    // --------------------------------------------------------
    // Allowed order transitions
    //
    // pending
    //    ↓
    // confirmed
    //    ↓
    // processing
    //    ↓
    // shipped
    //    ↓
    // delivered
    //
    // Cancellation is allowed before delivery.
    // --------------------------------------------------------

    const allowedTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
    };

    session.startTransaction();

    const order = await Order.findById(id).session(session);

    // --------------------------------------------------------
    // Order not found
    // --------------------------------------------------------

    if (!order) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const currentStatus = order.orderStatus;

    // --------------------------------------------------------
    // Same status
    // --------------------------------------------------------

    if (currentStatus === status) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: `Order is already ${status}.`,
      });
    }

    // --------------------------------------------------------
    // Validate transition
    // --------------------------------------------------------

    if (!allowedTransitions[currentStatus]?.includes(status)) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: `Order cannot be changed from ${currentStatus} to ${status}.`,
      });
    }

    // ========================================================
    // Cancellation
    // ========================================================

    if (status === "cancelled") {
      for (const item of order.items) {
        if (!item.book) {
          throw new Error(
            "Cannot restore stock because an order item has no book reference.",
          );
        }

        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
          throw new Error(
            "Cannot restore stock because an order item has an invalid quantity.",
          );
        }

        const updatedBook = await Book.findByIdAndUpdate(
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

        if (!updatedBook) {
          throw new Error(
            `Cannot restore stock because book ${item.book} was not found.`,
          );
        }
      }
    }

    // ========================================================
    // Delivered + COD
    //
    // COD becomes paid when the order is delivered.
    // ========================================================

    if (status === "delivered" && order.paymentMethod === "COD") {
      order.paymentStatus = "paid";
    }

    // --------------------------------------------------------
    // Update status
    // --------------------------------------------------------

    order.orderStatus = status;

    await order.save({ session });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}.`,
      order,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Update order status error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update order status.",
    });
  } finally {
    await session.endSession();
  }
};

// ============================================================
// Get All Users
// ============================================================

const getAllUsers = async (req, res) => {
  try {
    const search = normalizeSearch(req.query.search);
    const { page, limit, skip } = getPagination(req.query);

    const filter = {
      role: "user",
    };

    // --------------------------------------------------------
    // Search by name or email
    // --------------------------------------------------------

    if (search) {
      const safeSearch = escapeRegex(search);

      filter.$or = [
        {
          name: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          email: {
            $regex: safeSearch,
            $options: "i",
          },
        },
      ];
    }

    // --------------------------------------------------------
    // Count + fetch
    // --------------------------------------------------------

    const [totalUsers, users] = await Promise.all([
      User.countDocuments(filter),

      User.find(filter)
        .select("_id name email role avatar isActive createdAt updatedAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        totalUsers,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load users.",
    });
  }
};

// ============================================================
// Export
// ============================================================

export { getDashboardStats, getAllOrders, updateOrderStatus, getAllUsers };
