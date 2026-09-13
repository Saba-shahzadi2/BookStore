import mongoose from "mongoose";
import Book from "../models/Book.js";

// ==========================================
// Constants
// ==========================================

const MAX_PAGE = 100000;
const MAX_LIMIT = 100;
const MAX_SEARCH_LENGTH = 100;
const MAX_CATEGORY_LENGTH = 50;

// ==========================================
// Helpers
// ==========================================

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getPagination = (query, defaultLimit = 12) => {
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

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
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
      message: "Invalid book ID",
    });
  }

  return null;
};

const isBoolean = (value) => {
  return typeof value === "boolean";
};

const validateStringField = (value, fieldName, minLength, maxLength) => {
  if (typeof value !== "string") {
    return `${fieldName} must be a string`;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return `${fieldName} cannot be empty`;
  }

  if (trimmedValue.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }

  if (trimmedValue.length > maxLength) {
    return `${fieldName} cannot exceed ${maxLength} characters`;
  }

  return null;
};

const validateBookFields = ({ title, author, description, category }) => {
  const validations = [
    {
      value: title,
      fieldName: "Title",
      minLength: 2,
      maxLength: 150,
    },
    {
      value: author,
      fieldName: "Author",
      minLength: 2,
      maxLength: 100,
    },
    {
      value: description,
      fieldName: "Description",
      minLength: 10,
      maxLength: 2000,
    },
    {
      value: category,
      fieldName: "Category",
      minLength: 2,
      maxLength: 50,
    },
  ];

  for (const field of validations) {
    const error = validateStringField(
      field.value,
      field.fieldName,
      field.minLength,
      field.maxLength,
    );

    if (error) {
      return error;
    }
  }

  return null;
};

const parsePrice = (value) => {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return null;
  }

  return value;
};

const parseStock = (value) => {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    return null;
  }

  return value;
};

const validateCoverImage = (coverImage) => {
  if (coverImage === undefined || coverImage === null) {
    return "";
  }

  if (typeof coverImage !== "string") {
    return null;
  }

  const trimmedCoverImage = coverImage.trim();

  if (trimmedCoverImage.length > 500) {
    return null;
  }

  return trimmedCoverImage;
};

// ==========================================
// Get All Books - Public
// ==========================================

const getBooks = async (req, res) => {
  try {
    const { search, category, featured } = req.query;

    const { page, limit, skip } = getPagination(req.query, 12);

    const filter = {
      isActive: true,
    };

    // ==========================================
    // Search
    // ==========================================

    if (search !== undefined) {
      if (typeof search !== "string") {
        return res.status(400).json({
          success: false,
          message: "Search must be a valid string",
        });
      }

      const trimmedSearch = search.trim();

      if (trimmedSearch.length > MAX_SEARCH_LENGTH) {
        return res.status(400).json({
          success: false,
          message: `Search cannot exceed ${MAX_SEARCH_LENGTH} characters`,
        });
      }

      if (trimmedSearch) {
        const safeSearch = escapeRegex(trimmedSearch);

        filter.$or = [
          {
            title: {
              $regex: safeSearch,
              $options: "i",
            },
          },
          {
            author: {
              $regex: safeSearch,
              $options: "i",
            },
          },
        ];
      }
    }

    // ==========================================
    // Category Filter
    // ==========================================

    if (category !== undefined) {
      if (typeof category !== "string") {
        return res.status(400).json({
          success: false,
          message: "Category must be a valid string",
        });
      }

      const trimmedCategory = category.trim();

      if (trimmedCategory.length > MAX_CATEGORY_LENGTH) {
        return res.status(400).json({
          success: false,
          message: "Category cannot exceed 50 characters",
        });
      }

      if (trimmedCategory) {
        filter.category = trimmedCategory;
      }
    }

    // ==========================================
    // Featured Filter
    // ==========================================

    if (featured !== undefined) {
      if (featured !== "true" && featured !== "false") {
        return res.status(400).json({
          success: false,
          message: "Featured filter must be true or false",
        });
      }

      if (featured === "true") {
        filter.isFeatured = true;
      }

      if (featured === "false") {
        filter.isFeatured = false;
      }
    }

    // ==========================================
    // Query
    // ==========================================

    const [books, total] = await Promise.all([
      Book.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Book.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      books,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get Books Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching books",
    });
  }
};

// ==========================================
// Get Single Book - Public
// ==========================================

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const book = await Book.findOne({
      _id: id,
      isActive: true,
    }).lean();

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    console.error("Get Book Error:", error);

    const handled = handleValidationError(error, res);

    if (handled) {
      return;
    }

    return res.status(500).json({
      success: false,
      message: "Server error while fetching book",
    });
  }
};

// ==========================================
// Get All Books - Admin
// Includes Active + Inactive Books
// ==========================================

const getAdminBooks = async (req, res) => {
  try {
    const { search } = req.query;

    const { page, limit, skip } = getPagination(req.query, 10);

    const filter = {};

    // ==========================================
    // Search
    // ==========================================

    if (search !== undefined) {
      if (typeof search !== "string") {
        return res.status(400).json({
          success: false,
          message: "Search must be a valid string",
        });
      }

      const trimmedSearch = search.trim();

      if (trimmedSearch.length > MAX_SEARCH_LENGTH) {
        return res.status(400).json({
          success: false,
          message: `Search cannot exceed ${MAX_SEARCH_LENGTH} characters`,
        });
      }

      if (trimmedSearch) {
        const safeSearch = escapeRegex(trimmedSearch);

        filter.$or = [
          {
            title: {
              $regex: safeSearch,
              $options: "i",
            },
          },
          {
            author: {
              $regex: safeSearch,
              $options: "i",
            },
          },
        ];
      }
    }

    // ==========================================
    // Query
    // ==========================================

    const [books, total] = await Promise.all([
      Book.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Book.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      books,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get Admin Books Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching admin books",
    });
  }
};

// ==========================================
// Create Book - Admin
// ==========================================

const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      price,
      category,
      coverImage,
      stock,
      isFeatured,
    } = req.body || {};

    // ==========================================
    // Required String Validation
    // ==========================================

    const stringValidationError = validateBookFields({
      title,
      author,
      description,
      category,
    });

    if (stringValidationError) {
      return res.status(400).json({
        success: false,
        message: stringValidationError,
      });
    }

    // ==========================================
    // Price Validation
    // ==========================================

    if (price === undefined || price === null || price === "") {
      return res.status(400).json({
        success: false,
        message: "Price is required",
      });
    }

    const numericPrice = parsePrice(price);

    if (numericPrice === null) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid non-negative number",
      });
    }

    // ==========================================
    // Stock Validation
    // ==========================================

    const numericStock =
      stock === undefined || stock === null || stock === ""
        ? 0
        : parseStock(stock);

    if (numericStock === null) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a valid non-negative integer",
      });
    }

    // ==========================================
    // Cover Image Validation
    // ==========================================

    const validatedCoverImage = validateCoverImage(coverImage);

    if (
      coverImage !== undefined &&
      coverImage !== null &&
      validatedCoverImage === null
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cover image must be a valid string with maximum 500 characters",
      });
    }

    // ==========================================
    // Featured Validation
    // ==========================================

    if (isFeatured !== undefined && !isBoolean(isFeatured)) {
      return res.status(400).json({
        success: false,
        message: "isFeatured must be a boolean",
      });
    }

    // ==========================================
    // Create Book
    // ==========================================

    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      description: description.trim(),
      price: numericPrice,
      category: category.trim(),
      coverImage: validatedCoverImage || "",
      stock: numericStock,
      isFeatured: isFeatured ?? false,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    console.error("Create Book Error:", error);

    const handled = handleValidationError(error, res);

    if (handled) {
      return;
    }

    return res.status(500).json({
      success: false,
      message: "Server error while creating book",
    });
  }
};

// ==========================================
// Update Book - Admin
// ==========================================

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const allowedFields = [
      "title",
      "author",
      "description",
      "price",
      "category",
      "coverImage",
      "stock",
      "isFeatured",
      "isActive",
    ];

    // ==========================================
    // Assign Only Allowed Fields
    // ==========================================

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        book[field] = req.body[field];
      }
    }

    // ==========================================
    // String Fields
    // ==========================================

    const stringFields = ["title", "author", "description", "category"];

    for (const field of stringFields) {
      if (typeof book[field] === "string") {
        book[field] = book[field].trim();
      }
    }

    // ==========================================
    // Validate Required Book Fields
    // ==========================================

    const stringValidationError = validateBookFields({
      title: book.title,
      author: book.author,
      description: book.description,
      category: book.category,
    });

    if (stringValidationError) {
      return res.status(400).json({
        success: false,
        message: stringValidationError,
      });
    }

    // ==========================================
    // Cover Image Validation
    // ==========================================

    const validatedCoverImage = validateCoverImage(book.coverImage);

    if (
      book.coverImage !== undefined &&
      book.coverImage !== null &&
      validatedCoverImage === null
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cover image must be a valid string with maximum 500 characters",
      });
    }

    book.coverImage = validatedCoverImage || "";

    // ==========================================
    // Price Validation
    // ==========================================

    const numericPrice = parsePrice(book.price);

    if (numericPrice === null) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid non-negative number",
      });
    }

    book.price = numericPrice;

    // ==========================================
    // Stock Validation
    // ==========================================

    const numericStock = parseStock(book.stock);

    if (numericStock === null) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a valid non-negative integer",
      });
    }

    book.stock = numericStock;

    // ==========================================
    // Boolean Validation
    // ==========================================

    if (!isBoolean(book.isFeatured)) {
      return res.status(400).json({
        success: false,
        message: "isFeatured must be a boolean",
      });
    }

    if (!isBoolean(book.isActive)) {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean",
      });
    }

    // ==========================================
    // Save
    // ==========================================

    await book.save();

    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    console.error("Update Book Error:", error);

    const handled = handleValidationError(error, res);

    if (handled) {
      return;
    }

    return res.status(500).json({
      success: false,
      message: "Server error while updating book",
    });
  }
};

// ==========================================
// Delete Book - Admin
// Soft Delete
// ==========================================

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (!book.isActive) {
      return res.status(400).json({
        success: false,
        message: "Book is already deleted",
      });
    }

    book.isActive = false;

    await book.save();

    return res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      book,
    });
  } catch (error) {
    console.error("Delete Book Error:", error);

    const handled = handleValidationError(error, res);

    if (handled) {
      return;
    }

    return res.status(500).json({
      success: false,
      message: "Server error while deleting book",
    });
  }
};

// ==========================================
// Restore Book - Admin
// ==========================================

const restoreBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.isActive) {
      return res.status(400).json({
        success: false,
        message: "Book is already active",
      });
    }

    book.isActive = true;

    await book.save();

    return res.status(200).json({
      success: true,
      message: "Book restored successfully",
      book,
    });
  } catch (error) {
    console.error("Restore Book Error:", error);

    const handled = handleValidationError(error, res);

    if (handled) {
      return;
    }

    return res.status(500).json({
      success: false,
      message: "Server error while restoring book",
    });
  }
};

// ==========================================
// Exports
// ==========================================

export {
  getBooks,
  getBookById,
  getAdminBooks,
  createBook,
  updateBook,
  deleteBook,
  restoreBook,
};
