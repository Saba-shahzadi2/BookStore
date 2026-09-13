import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ==========================================
    // Basic Information
    // ==========================================

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [150, "Email cannot exceed 150 characters"],
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      maxlength: [128, "Password cannot exceed 128 characters"],
      select: false,
    },

    // ==========================================
    // Role
    // ==========================================

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },

    // ==========================================
    // Password Reset / OTP
    // ==========================================

    // Stores a SHA-256 hash of the OTP, never the
    // original plaintext OTP.
    resetOTP: {
      type: String,
      default: null,
      select: false,
    },

    resetOTPExpires: {
      type: Date,
      default: null,
      select: false,
    },

    resetOTPVerified: {
      type: Boolean,
      default: false,
      select: false,
    },

    // Number of incorrect OTP verification attempts.
    // Used to prevent OTP brute-force attacks.
    resetOTPAttempts: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      select: false,
    },

    // ==========================================
    // Password Security
    // ==========================================

    // Used to invalidate previously issued JWTs
    // after a successful password change/reset.
    passwordChangedAt: {
      type: Date,
      default: null,
      select: false,
    },

    // ==========================================
    // Profile
    // ==========================================

    avatar: {
      type: String,
      default: "",
      trim: true,
      maxlength: [500, "Avatar URL cannot exceed 500 characters"],
    },

    // ==========================================
    // Account Status
    // ==========================================

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// Model
// ==========================================

const User = mongoose.model("User", userSchema);

export default User;
