import mongoose from "mongoose";
import Contact from "../models/Contact.js";

// ============================================================
// Constants
// ============================================================

const CONTACT_STATUSES = ["new", "read", "replied"];

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
// Get All Contact Messages
// ============================================================

const getAllContactMessages = async (req, res) => {
  try {
    const { status } = req.query;
    const search = normalizeSearch(req.query.search);

    const { page, limit, skip } = getPagination(req.query);

    const filter = {};

    // --------------------------------------------------------
    // Status filter
    // --------------------------------------------------------

    if (status) {
      if (!CONTACT_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid contact message status.",
        });
      }

      filter.status = status;
    }

    // --------------------------------------------------------
    // Search filter
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
        {
          subject: {
            $regex: safeSearch,
            $options: "i",
          },
        },
      ];
    }

    // --------------------------------------------------------
    // Count + fetch
    // --------------------------------------------------------

    const [totalMessages, messages] = await Promise.all([
      Contact.countDocuments(filter),

      Contact.find(filter)
        .select("_id name email subject message status createdAt updatedAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.ceil(totalMessages / limit);

    return res.status(200).json({
      success: true,
      messages,
      pagination: {
        page,
        limit,
        totalMessages,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get contact messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load contact messages.",
    });
  }
};

// ============================================================
// Get Single Contact Message
// ============================================================

const getContactMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    // --------------------------------------------------------
    // Validate ID
    // --------------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact message ID.",
      });
    }

    // --------------------------------------------------------
    // Find message
    // --------------------------------------------------------

    const message = await Contact.findById(id)
      .select("_id name email subject message status createdAt updatedAt")
      .lean();

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Get contact message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load contact message.",
    });
  }
};

// ============================================================
// Update Contact Message Status
// ============================================================

const updateContactMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // --------------------------------------------------------
    // Validate ID
    // --------------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact message ID.",
      });
    }

    // --------------------------------------------------------
    // Validate status
    // --------------------------------------------------------

    if (!CONTACT_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact message status.",
      });
    }

    // --------------------------------------------------------
    // Update
    // --------------------------------------------------------

    const message = await Contact.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .select("_id name email subject message status createdAt updatedAt")
      .lean();

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact message status updated successfully.",
      data: message,
    });
  } catch (error) {
    console.error("Update contact message status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update contact message status.",
    });
  }
};

// ============================================================
// Delete Contact Message
// ============================================================

const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    // --------------------------------------------------------
    // Validate ID
    // --------------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact message ID.",
      });
    }

    // --------------------------------------------------------
    // Delete
    // --------------------------------------------------------

    const message = await Contact.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact message deleted successfully.",
    });
  } catch (error) {
    console.error("Delete contact message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete contact message.",
    });
  }
};

// ============================================================
// Export
// ============================================================

export {
  getAllContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage,
};
