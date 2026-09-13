import express from "express";

import {
  register,
  login,
  getMe,
  forgotPassword,
  verifyOTP,
  resendOTP,
  resetPassword,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

import {
  loginLimiter,
  registerLimiter,
  passwordResetLimiter,
  otpLimiter,
} from "../middleware/rateLimitMiddleware.js";

import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateVerifyOTP,
  validateResendOTP,
  validateResetPassword,
} from "../validators/authValidator.js";

const router = express.Router();

// ==========================================
// Authentication
// ==========================================

router.post("/register", registerLimiter, validateRegister, register);

router.post("/login", loginLimiter, validateLogin, login);

router.get("/me", protect, getMe);

// ==========================================
// Password Reset
// ==========================================

router.post(
  "/forgot-password",
  passwordResetLimiter,
  validateForgotPassword,
  forgotPassword,
);

router.post("/verify-otp", otpLimiter, validateVerifyOTP, verifyOTP);

router.post("/resend-otp", otpLimiter, validateResendOTP, resendOTP);

router.post(
  "/reset-password",
  passwordResetLimiter,
  validateResetPassword,
  resetPassword,
);

export default router;
