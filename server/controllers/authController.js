import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

// ==========================================
// Constants
// ==========================================

const JWT_EXPIRES_IN = "7d";
const RESET_TOKEN_EXPIRES_IN = "10m";
const OTP_EXPIRES_IN_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

// ==========================================
// JWT Secret Validation
// ==========================================

const getJWTSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return process.env.JWT_SECRET;
};

// ==========================================
// Generate Login JWT
// ==========================================

const generateToken = (userId) => {
  return jwt.sign(
    {
      userId: userId.toString(),
    },
    getJWTSecret(),
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  );
};

// ==========================================
// Generate Password Reset JWT
// ==========================================

const generateResetToken = (userId) => {
  return jwt.sign(
    {
      userId: userId.toString(),
      purpose: "password-reset",
    },
    getJWTSecret(),
    {
      expiresIn: RESET_TOKEN_EXPIRES_IN,
    },
  );
};

// ==========================================
// Generate Secure OTP
// ==========================================

const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

// ==========================================
// Hash OTP
// ==========================================

const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

// ==========================================
// Compare OTP Hashes
// ==========================================

const isOTPValid = (otp, storedHash) => {
  if (typeof storedHash !== "string" || !/^[a-f0-9]{64}$/i.test(storedHash)) {
    return false;
  }

  const incomingHash = hashOTP(otp);

  const incomingBuffer = Buffer.from(incomingHash, "hex");
  const storedBuffer = Buffer.from(storedHash, "hex");

  if (incomingBuffer.length !== storedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(incomingBuffer, storedBuffer);
};

// ==========================================
// Normalize Email
// ==========================================

const normalizeEmail = (email) => {
  if (typeof email !== "string") {
    return "";
  }

  return email.trim().toLowerCase();
};

// ==========================================
// Clean String
// ==========================================

const cleanString = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

// ==========================================
// Email Validation
// ==========================================

const isValidEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

// ==========================================
// Password Validation
// ==========================================

const validatePassword = (password) => {
  if (typeof password !== "string") {
    return "Password must be a valid string";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  if (password.length > 128) {
    return "Password cannot exceed 128 characters";
  }

  return null;
};

// ==========================================
// Escape HTML
// ==========================================

const escapeHtml = (value) => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// ==========================================
// User Response
// ==========================================

const getSafeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  };
};

// ==========================================
// Clear OTP State
// ==========================================

const clearOTPState = (user) => {
  user.resetOTP = null;
  user.resetOTPExpires = null;
  user.resetOTPVerified = false;
  user.resetOTPAttempts = 0;
};

// ==========================================
// Register
// ==========================================

const register = async (req, res) => {
  try {
    const name = cleanString(req.body?.name);
    const email = normalizeEmail(req.body?.email);
    const password = req.body?.password;

    // ------------------------------------------
    // Required fields
    // ------------------------------------------

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // ------------------------------------------
    // Name validation
    // ------------------------------------------

    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 50 characters",
      });
    }

    // ------------------------------------------
    // Email validation
    // ------------------------------------------

    if (email.length > 150 || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // ------------------------------------------
    // Password validation
    // ------------------------------------------

    const passwordError = validatePassword(password);

    if (passwordError) {
      return res.status(400).json({
        success: false,
        message: passwordError,
      });
    }

    // ------------------------------------------
    // Check existing user
    // ------------------------------------------

    const existingUser = await User.findOne({
      email,
    }).select("_id");

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // ------------------------------------------
    // Hash password
    // ------------------------------------------

    const hashedPassword = await bcrypt.hash(password, 12);

    // ------------------------------------------
    // Create user
    // ------------------------------------------

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // ------------------------------------------
    // Generate JWT
    // ------------------------------------------

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: getSafeUser(user),
    });
  } catch (error) {
    console.error("Register Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while creating account",
    });
  }
};

// ==========================================
// Login
// ==========================================

const login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = req.body?.password;

    // ------------------------------------------
    // Required fields
    // ------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ------------------------------------------
    // Email validation
    // ------------------------------------------

    if (email.length > 150 || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ------------------------------------------
    // Password validation
    // ------------------------------------------

    if (typeof password !== "string" || password.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ------------------------------------------
    // Find user with password
    // ------------------------------------------

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ------------------------------------------
    // Account status
    // ------------------------------------------

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive",
      });
    }

    // ------------------------------------------
    // Compare password
    // ------------------------------------------

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ------------------------------------------
    // Generate JWT
    // ------------------------------------------

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: getSafeUser(user),
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while logging in",
    });
  }
};

// ==========================================
// Get Current User
// ==========================================

const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    return res.status(200).json({
      success: true,
      user: getSafeUser(req.user),
    });
  } catch (error) {
    console.error("Get Me Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// Forgot Password - Send OTP
// ==========================================

const forgotPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (email.length > 150 || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const user = await User.findOne({
      email,
    });

    // ------------------------------------------
    // Prevent account enumeration
    // ------------------------------------------

    if (!user || !user.isActive) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset OTP has been sent.",
      });
    }

    // ------------------------------------------
    // Generate OTP
    // ------------------------------------------

    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    const otpExpires = new Date(Date.now() + OTP_EXPIRES_IN_MS);

    user.resetOTP = hashedOTP;
    user.resetOTPExpires = otpExpires;
    user.resetOTPVerified = false;
    user.resetOTPAttempts = 0;

    await user.save();

    // ------------------------------------------
    // Send OTP email
    // ------------------------------------------

    try {
      const safeName = escapeHtml(user.name);

      await sendEmail({
        to: user.email,
        subject: "BookStore Password Reset OTP",

        text: `Your BookStore password reset OTP is ${otp}. This OTP will expire in 10 minutes.`,

        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 20px;
          ">
            <h2>BookStore Password Reset</h2>

            <p>Hello ${safeName},</p>

            <p>
              We received a request to reset your
              BookStore password.
            </p>

            <p>Your OTP is:</p>

            <div style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              padding: 15px;
              background: #f1f5f9;
              text-align: center;
              margin: 20px 0;
            ">
              ${otp}
            </div>

            <p>
              This OTP will expire in
              <strong>10 minutes</strong>.
            </p>

            <p>
              If you did not request a password reset,
              you can safely ignore this email.
            </p>

            <p>
              Regards,<br />
              BookStore Team
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("OTP Email Error:", emailError);

      clearOTPState(user);

      await user.save();

      return res.status(500).json({
        success: false,
        message: "Unable to send OTP. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset OTP has been sent.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process password reset request.",
    });
  }
};

// ==========================================
// Verify OTP
// ==========================================

const verifyOTP = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const otp = cleanString(req.body?.otp);

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    if (email.length > 150 || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP verification request",
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must be a 6-digit number",
      });
    }

    // ------------------------------------------
    // Find user and explicitly select OTP state
    // ------------------------------------------

    const user = await User.findOne({
      email,
    }).select("+resetOTP +resetOTPExpires +resetOTPVerified +resetOTPAttempts");

    if (!user || !user.isActive) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // ------------------------------------------
    // Check OTP existence
    // ------------------------------------------

    if (!user.resetOTP || !user.resetOTPExpires) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // ------------------------------------------
    // Check expiration
    // ------------------------------------------

    if (new Date() > user.resetOTPExpires) {
      clearOTPState(user);

      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // ------------------------------------------
    // Check maximum OTP attempts
    // ------------------------------------------

    if (user.resetOTPAttempts >= MAX_OTP_ATTEMPTS) {
      clearOTPState(user);

      await user.save();

      return res.status(429).json({
        success: false,
        message: "Too many incorrect OTP attempts. Please request a new OTP.",
      });
    }

    // ------------------------------------------
    // Verify hashed OTP
    // ------------------------------------------

    if (!isOTPValid(otp, user.resetOTP)) {
      user.resetOTPAttempts += 1;

      if (user.resetOTPAttempts >= MAX_OTP_ATTEMPTS) {
        clearOTPState(user);

        await user.save();

        return res.status(429).json({
          success: false,
          message: "Too many incorrect OTP attempts. Please request a new OTP.",
        });
      }

      await user.save();

      const remainingAttempts = MAX_OTP_ATTEMPTS - user.resetOTPAttempts;

      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${remainingAttempts} attempt${
          remainingAttempts === 1 ? "" : "s"
        } remaining.`,
      });
    }

    // ------------------------------------------
    // OTP verified
    // ------------------------------------------

    user.resetOTPVerified = true;
    user.resetOTP = null;
    user.resetOTPExpires = null;
    user.resetOTPAttempts = 0;

    await user.save();

    // ------------------------------------------
    // Generate short-lived reset token
    // ------------------------------------------

    const resetToken = generateResetToken(user._id);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      resetToken,
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while verifying OTP",
    });
  }
};

// ==========================================
// Resend OTP
// ==========================================

const resendOTP = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (email.length > 150 || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const user = await User.findOne({
      email,
    });

    // ------------------------------------------
    // Prevent account enumeration
    // ------------------------------------------

    if (!user || !user.isActive) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a new OTP has been sent.",
      });
    }

    // ------------------------------------------
    // Generate new OTP
    // ------------------------------------------

    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    const otpExpires = new Date(Date.now() + OTP_EXPIRES_IN_MS);

    user.resetOTP = hashedOTP;
    user.resetOTPExpires = otpExpires;
    user.resetOTPVerified = false;
    user.resetOTPAttempts = 0;

    await user.save();

    // ------------------------------------------
    // Send email
    // ------------------------------------------

    try {
      const safeName = escapeHtml(user.name);

      await sendEmail({
        to: user.email,
        subject: "BookStore New Password Reset OTP",

        text: `Your new BookStore password reset OTP is ${otp}. This OTP will expire in 10 minutes.`,

        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 20px;
          ">
            <h2>BookStore Password Reset</h2>

            <p>Hello ${safeName},</p>

            <p>
              Your new password reset OTP is:
            </p>

            <div style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              padding: 15px;
              background: #f1f5f9;
              text-align: center;
              margin: 20px 0;
            ">
              ${otp}
            </div>

            <p>
              This OTP will expire in
              <strong>10 minutes</strong>.
            </p>

            <p>
              Regards,<br />
              BookStore Team
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Resend OTP Email Error:", emailError);

      clearOTPState(user);

      await user.save();

      return res.status(500).json({
        success: false,
        message: "Unable to resend OTP. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "If an account exists with this email, a new OTP has been sent.",
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to resend OTP. Please try again.",
    });
  }
};

// ==========================================
// Reset Password
// ==========================================

const resetPassword = async (req, res) => {
  try {
    const token = cleanString(req.body?.token);
    const password = req.body?.password;

    // ------------------------------------------
    // Required fields
    // ------------------------------------------

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Reset token and password are required",
      });
    }

    // ------------------------------------------
    // Password validation
    // ------------------------------------------

    const passwordError = validatePassword(password);

    if (passwordError) {
      return res.status(400).json({
        success: false,
        message: passwordError,
      });
    }

    // ------------------------------------------
    // Verify reset token
    // ------------------------------------------

    let decoded;

    try {
      decoded = jwt.verify(token, getJWTSecret(), {
        algorithms: ["HS256"],
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Reset token is invalid or expired",
      });
    }

    // ------------------------------------------
    // Validate token payload
    // ------------------------------------------

    if (
      !decoded ||
      typeof decoded !== "object" ||
      typeof decoded.userId !== "string" ||
      decoded.purpose !== "password-reset"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    // ------------------------------------------
    // Find user
    // ------------------------------------------

    const user = await User.findById(decoded.userId).select(
      "+password +passwordChangedAt +resetOTPVerified",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ------------------------------------------
    // Account status
    // ------------------------------------------

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive",
      });
    }

    // ------------------------------------------
    // OTP verification required
    // ------------------------------------------

    if (!user.resetOTPVerified) {
      return res.status(400).json({
        success: false,
        message: "OTP verification is required",
      });
    }

    // ------------------------------------------
    // Hash new password
    // ------------------------------------------

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;

    // ------------------------------------------
    // Invalidate existing login sessions
    // ------------------------------------------

    user.passwordChangedAt = new Date();

    // ------------------------------------------
    // Clear password reset state
    // ------------------------------------------

    clearOTPState(user);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while resetting password",
    });
  }
};

// ==========================================
// Exports
// ==========================================

export {
  register,
  login,
  getMe,
  forgotPassword,
  verifyOTP,
  resendOTP,
  resetPassword,
};
