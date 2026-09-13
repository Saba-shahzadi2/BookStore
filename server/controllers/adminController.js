import mongoose from "mongoose";

import User from "../models/User.js";
import Book from "../models/Book.js";
import Order from "../models/Order.js";

// ==========================================
// Constants
// ==========================================

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

// ==========================================
// Helpers
// ==========================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// ==========================================
// Pagination Helper
// ==========================================

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

// ==========================================
// Dashboard Stats
// ==========================================

const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalBooks, totalOrders, revenueResult, pendingOrders] =
      await Promise.all([
        // Normal customers only
        User.countDocuments({
          role: "user",
        }),

        // Active books only
        Book.countDocuments({
          isActive: true,
        }),

        // All orders
        Order.countDocuments(),

        // Revenue from paid, non-cancelled orders
        Order.aggregate([
          {
            $match: {
              paymentStatus: "paid",
              orderStatus: {
                $ne: "cancelled",
              },
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$total",
              },
            },
          },
        ]),

        // Pending orders
        Order.countDocuments({
          orderStatus: "pending",
        }),
      ]);

    const totalRevenue = Number((revenueResult[0]?.total || 0).toFixed(2));

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalBooks,
        totalOrders,
        totalRevenue,
        pendingOrders,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard stats",
    });
  }
};

// ==========================================
// Get All Orders
// ==========================================

const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;

    const { page, limit, skip } = getPagination(req.query, 10);

    const filter = {};

    // ==========================================
    // Status Filter
    // ==========================================

    if (status !== undefined) {
      if (typeof status !== "string" || !ORDER_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status",
        });
      }

      filter.orderStatus = status;
    }

    // ==========================================
    // Fetch Orders + Count
    // ==========================================

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("user", "name email")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Order.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
    });
  }
};

// ==========================================
// Update Order Status
// ==========================================

const updateOrderStatus = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { status } = req.body;
    const { id: orderId } = req.params;

    // ==========================================
    // Validate Status
    // ==========================================

    if (typeof status !== "string" || !ORDER_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    // ==========================================
    // Validate Order ID
    // ==========================================

    if (!isValidObjectId(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    // ==========================================
    // Allowed Transitions
    // ==========================================

    const allowedTransitions = {
      pending: ["confirmed", "cancelled"],

      confirmed: ["processing", "cancelled"],

      processing: ["shipped", "cancelled"],

      shipped: ["delivered"],

      delivered: [],

      cancelled: [],
    };

    // ==========================================
    // Start Transaction
    // ==========================================

    session.startTransaction();

    const order = await Order.findById(orderId).session(session);

    if (!order) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const currentStatus = order.orderStatus;

    // ==========================================
    // Prevent Same Status
    // ==========================================

    if (currentStatus === status) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: `Order is already ${status}`,
      });
    }

    // ==========================================
    // Validate Transition
    // ==========================================

    const nextStatuses = allowedTransitions[currentStatus] || [];

    if (!nextStatuses.includes(status)) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message:
          `Cannot change order status from ` + `${currentStatus} to ${status}`,
      });
    }

    // ==========================================
    // Cancel Order
    // Restore Stock
    // ==========================================

    if (status === "cancelled") {
      for (const item of order.items) {
        if (!item.book || !isValidObjectId(item.book)) {
          throw new Error("Invalid book reference in order");
        }

        if (!Number.isInteger(item.quantity) || item.quantity < 1) {
          throw new Error("Invalid quantity in order");
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
            `Book "${item.title}" was not found while restoring stock`,
          );
        }
      }

      // ==========================================
      // Payment Handling
      // ==========================================

      /*
       * This project does not currently have an
       * automatic payment/refund gateway.
       *
       * Therefore, do not mark a cancelled order
       * as "paid" or "refunded" here.
       *
       * Existing payment status is preserved.
       * Dashboard revenue already excludes
       * cancelled orders.
       */
    }

    // ==========================================
    // COD Payment
    // ==========================================

    /*
     * COD becomes paid only after successful
     * delivery.
     */
    if (status === "delivered" && order.paymentMethod === "COD") {
      order.paymentStatus = "paid";
    }

    // ==========================================
    // Update Order
    // ==========================================

    order.orderStatus = status;

    await order.save({
      session,
    });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    if (session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error("Transaction Abort Error:", abortError);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Server error while updating order",
    });
  } finally {
    await session.endSession();
  }
};

// ==========================================
// Get All Users
// ==========================================

const getAllUsers = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const { page, limit, skip } = getPagination(req.query, 10);

    // ==========================================
    // Only Normal Customers
    // ==========================================

    const filter = {
      role: "user",
    };

    // ==========================================
    // Search Validation
    // ==========================================

    if (search !== undefined && typeof search !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid search value",
      });
    }

    const searchValue = typeof search === "string" ? search.trim() : "";

    if (searchValue.length > MAX_SEARCH_LENGTH) {
      return res.status(400).json({
        success: false,
        message: "Search cannot exceed 100 characters",
      });
    }

    // ==========================================
    // Search By Name / Email
    // ==========================================

    if (searchValue) {
      const escapedSearch = escapeRegex(searchValue);

      filter.$or = [
        {
          name: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          email: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ];
    }

    // ==========================================
    // Fetch Users + Count
    // ==========================================

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("_id name email role avatar isActive createdAt updatedAt")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get All Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
};

// ==========================================
// Exports
// ==========================================

export { getDashboardStats, getAllOrders, updateOrderStatus, getAllUsers };
