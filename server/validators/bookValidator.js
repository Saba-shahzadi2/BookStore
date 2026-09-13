// ==========================================
// Helpers
// ==========================================

const cleanString = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

const isBoolean = (value) => {
  return typeof value === "boolean";
};

const isValidPrice = (value) => {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
};

const isValidStock = (value) => {
  return Number.isInteger(value) && value >= 0;
};

const validateString = (value, fieldName, min, max) => {
  if (typeof value !== "string") {
    return `${fieldName} must be a string`;
  }

  const cleaned = value.trim();

  if (!cleaned) {
    return `${fieldName} is required`;
  }

  if (cleaned.length < min || cleaned.length > max) {
    return `${fieldName} must be between ${min} and ${max} characters`;
  }

  return null;
};

// ==========================================
// Create Book Validator
// ==========================================

const validateCreateBook = (req, res, next) => {
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

  const titleError = validateString(title, "Title", 2, 150);

  if (titleError) {
    return res.status(400).json({
      success: false,
      message: titleError,
    });
  }

  const authorError = validateString(author, "Author", 2, 100);

  if (authorError) {
    return res.status(400).json({
      success: false,
      message: authorError,
    });
  }

  const descriptionError = validateString(description, "Description", 10, 2000);

  if (descriptionError) {
    return res.status(400).json({
      success: false,
      message: descriptionError,
    });
  }

  const categoryError = validateString(category, "Category", 2, 50);

  if (categoryError) {
    return res.status(400).json({
      success: false,
      message: categoryError,
    });
  }

  if (!isValidPrice(price)) {
    return res.status(400).json({
      success: false,
      message: "Price must be a valid non-negative number",
    });
  }

  if (!isValidStock(stock)) {
    return res.status(400).json({
      success: false,
      message: "Stock must be a non-negative integer",
    });
  }

  if (coverImage !== undefined && coverImage !== null) {
    if (typeof coverImage !== "string") {
      return res.status(400).json({
        success: false,
        message: "Cover image must be a string",
      });
    }

    if (coverImage.trim().length > 500) {
      return res.status(400).json({
        success: false,
        message: "Cover image URL cannot exceed 500 characters",
      });
    }
  }

  if (isFeatured !== undefined && !isBoolean(isFeatured)) {
    return res.status(400).json({
      success: false,
      message: "isFeatured must be a boolean",
    });
  }

  next();
};

// ==========================================
// Update Book Validator
// ==========================================

const validateUpdateBook = (req, res, next) => {
  const body = req.body || {};

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

  const receivedFields = Object.keys(body);

  const invalidFields = receivedFields.filter(
    (field) => !allowedFields.includes(field),
  );

  if (invalidFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }

  if (Object.keys(body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one field is required",
    });
  }

  if (body.title !== undefined) {
    const error = validateString(body.title, "Title", 2, 150);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }
  }

  if (body.author !== undefined) {
    const error = validateString(body.author, "Author", 2, 100);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }
  }

  if (body.description !== undefined) {
    const error = validateString(body.description, "Description", 10, 2000);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }
  }

  if (body.category !== undefined) {
    const error = validateString(body.category, "Category", 2, 50);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }
  }

  if (body.price !== undefined && !isValidPrice(body.price)) {
    return res.status(400).json({
      success: false,
      message: "Price must be a valid non-negative number",
    });
  }

  if (body.stock !== undefined && !isValidStock(body.stock)) {
    return res.status(400).json({
      success: false,
      message: "Stock must be a non-negative integer",
    });
  }

  if (body.coverImage !== undefined) {
    if (typeof body.coverImage !== "string") {
      return res.status(400).json({
        success: false,
        message: "Cover image must be a string",
      });
    }

    if (body.coverImage.trim().length > 500) {
      return res.status(400).json({
        success: false,
        message: "Cover image URL cannot exceed 500 characters",
      });
    }
  }

  if (body.isFeatured !== undefined && !isBoolean(body.isFeatured)) {
    return res.status(400).json({
      success: false,
      message: "isFeatured must be a boolean",
    });
  }

  if (body.isActive !== undefined && !isBoolean(body.isActive)) {
    return res.status(400).json({
      success: false,
      message: "isActive must be a boolean",
    });
  }

  next();
};

export { validateCreateBook, validateUpdateBook };
