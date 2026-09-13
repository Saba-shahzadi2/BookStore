// ==========================================
// Helpers
// ==========================================

const cleanString = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

const isValidEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

// ==========================================
// Contact Validator
// ==========================================

const validateContactMessage = (req, res, next) => {
  const { name, email, subject, message } = req.body || {};

  const cleanName = cleanString(name);
  const cleanEmail = cleanString(email).toLowerCase();
  const cleanSubject = cleanString(subject);
  const cleanMessage = cleanString(message);

  // ==========================================
  // Name
  // ==========================================

  if (!cleanName) {
    return res.status(400).json({
      success: false,
      message: "Name is required",
    });
  }

  if (cleanName.length < 2 || cleanName.length > 100) {
    return res.status(400).json({
      success: false,
      message: "Name must be between 2 and 100 characters",
    });
  }

  // ==========================================
  // Email
  // ==========================================

  if (!cleanEmail) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  if (cleanEmail.length > 150) {
    return res.status(400).json({
      success: false,
      message: "Email cannot exceed 150 characters",
    });
  }

  if (!isValidEmail(cleanEmail)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address",
    });
  }

  // ==========================================
  // Subject
  // ==========================================

  if (!cleanSubject) {
    return res.status(400).json({
      success: false,
      message: "Subject is required",
    });
  }

  if (cleanSubject.length < 2 || cleanSubject.length > 200) {
    return res.status(400).json({
      success: false,
      message: "Subject must be between 2 and 200 characters",
    });
  }

  // ==========================================
  // Message
  // ==========================================

  if (!cleanMessage) {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }

  if (cleanMessage.length < 5 || cleanMessage.length > 2000) {
    return res.status(400).json({
      success: false,
      message: "Message must be between 5 and 2000 characters",
    });
  }

  next();
};

// ==========================================
// Export
// ==========================================

export { validateContactMessage };
