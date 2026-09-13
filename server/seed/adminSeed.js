import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../models/User.js";

// ==========================================
// Seed Admin User
// ==========================================

const seedAdmin = async () => {
  try {
    // ==========================================
    // Validate Environment Variables
    // ==========================================

    const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not configured");
    }

    if (!ADMIN_EMAIL) {
      throw new Error("ADMIN_EMAIL is not configured");
    }

    if (!ADMIN_PASSWORD) {
      throw new Error("ADMIN_PASSWORD is not configured");
    }

    if (ADMIN_PASSWORD.length < 6) {
      throw new Error("ADMIN_PASSWORD must be at least 6 characters");
    }

    const adminEmail = ADMIN_EMAIL.trim().toLowerCase();

    // ==========================================
    // Connect to MongoDB
    // ==========================================

    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB connected");

    // ==========================================
    // Check Existing Admin
    // ==========================================

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("Admin already exists");

      await mongoose.disconnect();

      return;
    }

    // ==========================================
    // Hash Admin Password
    // ==========================================

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // ==========================================
    // Create Admin
    // ==========================================

    await User.create({
      name: "Book Store Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully");
    console.log(`Admin email: ${adminEmail}`);

    // NEVER log the admin password

    await mongoose.disconnect();

    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Admin Seed Error:", error);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    process.exitCode = 1;
  }
};

seedAdmin();
