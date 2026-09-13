// ==========================================
// Common Helpers
// ==========================================

const cleanString = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

const isValidEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

const isValidPassword = (password) => {
  return (
    typeof password === "string" &&
    password.length >= 6 &&
    password.length <= 128
  );
};

const validateEmail = (email) => {
  if (typeof email !== "string" || !email.trim()) {
    return "Email is required";
  }

  const value = email.trim().toLowerCase();

  if (value.length > 150) {
    return "Email cannot exceed 150 characters";
  }

  if (!isValidEmail(value)) {
    return "Please enter a valid email address";
  }

  return null;
};

// ==========================================
// Register Validator
// ==========================================

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body || {};

  const cleanName = cleanString(name);
  const cleanEmail = cleanString(email).toLowerCase();

  if (!cleanName) {
    return res.status(400).json({
      success: false,
      message: "Name is required",
    });
  }

  if (cleanName.length < 2 || cleanName.length > 50) {
    return res.status(400).json({
      success: false,
      message: "Name must be between 2 and 50 characters",
    });
  }

  const emailError = validateEmail(cleanEmail);

  if (emailError) {
    return res.status(400).json({
      success: false,
      message: emailError,
    });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({
      success: false,
      message: "Password must be between 6 and 128 characters",
    });
  }

  next();
};

// ==========================================
// Login Validator
// ==========================================

const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};

  const cleanEmail = cleanString(email).toLowerCase();

  const emailError = validateEmail(cleanEmail);

  if (emailError) {
    return res.status(400).json({
      success: false,
      message: emailError,
    });
  }

  if (typeof password !== "string" || !password) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  if (password.length > 128) {
    return res.status(400).json({
      success: false,
      message: "Password cannot exceed 128 characters",
    });
  }

  next();
};

// ==========================================
// Forgot Password Validator
// ==========================================

const validateForgotPassword = (req, res, next) => {
  const { email } = req.body || {};

  const cleanEmail = cleanString(email).toLowerCase();

  const emailError = validateEmail(cleanEmail);

  if (emailError) {
    return res.status(400).json({
      success: false,
      message: emailError,
    });
  }

  next();
};

// ==========================================
// Verify OTP Validator
// ==========================================

const validateVerifyOTP = (req, res, next) => {
  const { email, otp } = req.body || {};

  const cleanEmail = cleanString(email).toLowerCase();

  const emailError = validateEmail(cleanEmail);

  if (emailError) {
    return res.status(400).json({
      success: false,
      message: emailError,
    });
  }

  if (typeof otp !== "string" && typeof otp !== "number") {
    return res.status(400).json({
      success: false,
      message: "OTP is required",
    });
  }

  const cleanOTP = String(otp).trim();

  if (!/^\d{6}$/.test(cleanOTP)) {
    return res.status(400).json({
      success: false,
      message: "OTP must be a 6-digit code",
    });
  }

  next();
};

// ==========================================
// Resend OTP Validator
// ==========================================

const validateResendOTP = (req, res, next) => {
  const { email } = req.body || {};

  const cleanEmail = cleanString(email).toLowerCase();

  const emailError = validateEmail(cleanEmail);

  if (emailError) {
    return res.status(400).json({
      success: false,
      message: emailError,
    });
  }

  next();
};

// ==========================================
// Reset Password Validator
// ==========================================

const validateResetPassword = (req, res, next) => {
  const { token, password } = req.body || {};

  if (typeof token !== "string" || !token.trim()) {
    return res.status(400).json({
      success: false,
      message: "Reset token is required",
    });
  }

  if (token.length > 1000) {
    return res.status(400).json({
      success: false,
      message: "Invalid reset token",
    });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({
      success: false,
      message: "Password must be between 6 and 128 characters",
    });
  }

  next();
};

// ==========================================
// Exports
// ==========================================

export {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateVerifyOTP,
  validateResendOTP,
  validateResetPassword,
};
