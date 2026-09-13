import rateLimit from "express-rate-limit";

// ==========================================
// General API Rate Limiter
// ==========================================

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  // Auth and contact routes have their own
  // dedicated rate limiters.
  skip: (req) => {
    return req.path.startsWith("/auth") || req.path.startsWith("/contact");
  },

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  },
});

// ==========================================
// Login Rate Limiter
// ==========================================

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many login attempts. Please try again later.",
    });
  },
});

// ==========================================
// Registration Rate Limiter
// ==========================================

export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many registration attempts. Please try again later.",
    });
  },
});

// ==========================================
// Password Reset Rate Limiter
// ==========================================

export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many password reset attempts. Please try again later.",
    });
  },
});

// ==========================================
// OTP Rate Limiter
// ==========================================

export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many OTP attempts. Please try again later.",
    });
  },
});

// ==========================================
// Contact Form Rate Limiter
// ==========================================

export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  // Contact has a dedicated limiter, so the
  // general API limiter will not apply to it.
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many contact requests. Please try again later.",
    });
  },
});
