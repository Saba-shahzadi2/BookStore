import mongoose from "mongoose";

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

const MAX_PAYMENT_REFERENCE_LENGTH = 100;

// ==========================================
// Helpers
// ==========================================

const cleanString = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ==========================================
// Shipping Address Validator
// ==========================================

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

// ==========================================
// Create Order Validator
// ==========================================

const validateCreateOrder = (req, res, next) => {
  const {
    shippingAddress,
    paymentMethod = "COD",
    paymentReference = "",
  } = req.body || {};

  // ==========================================
  // Shipping Address
  // ==========================================

  const shippingError = validateShippingAddress(shippingAddress);

  if (shippingError) {
    return res.status(400).json({
      success: false,
      message: shippingError,
    });
  }

  // ==========================================
  // Payment Method
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
  // Payment Reference
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

  if (cleanPaymentReference.length > MAX_PAYMENT_REFERENCE_LENGTH) {
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

  next();
};

// ==========================================
// Order ID Validator
// ==========================================

const validateOrderId = (req, res, next) => {
  const { id } = req.params;

  if (typeof id !== "string" || !id.trim() || !isValidObjectId(id.trim())) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID",
    });
  }

  next();
};

// ==========================================
// Exports
// ==========================================

export { validateCreateOrder, validateOrderId };
