import "dotenv/config";
import nodemailer from "nodemailer";

// ==========================================
// Environment Variables
// ==========================================

const { EMAIL_USER, EMAIL_PASS } = process.env;

// ==========================================
// Email Configuration
// ==========================================

if (!EMAIL_USER || !EMAIL_PASS) {
  console.warn(
    "Email configuration is missing. EMAIL_USER and EMAIL_PASS are required.",
  );
}

// ==========================================
// Create Transporter
// ==========================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// ==========================================
// Send Email
// ==========================================

const sendEmail = async ({ to, subject, text = "", html = "" }) => {
  // ==========================================
  // Validate Recipient
  // ==========================================

  if (typeof to !== "string" || !to.trim()) {
    throw new Error("Recipient email is required");
  }

  // ==========================================
  // Validate Subject
  // ==========================================

  if (typeof subject !== "string" || !subject.trim()) {
    throw new Error("Email subject is required");
  }

  // ==========================================
  // Validate Content
  // ==========================================

  if (typeof text !== "string" || typeof html !== "string") {
    throw new Error("Email content must be valid strings");
  }

  if (!text && !html) {
    throw new Error("Email content is required");
  }

  // ==========================================
  // Validate Email Configuration
  // ==========================================

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error("Email service is not configured");
  }

  // ==========================================
  // Send Email
  // ==========================================

  await transporter.sendMail({
    from: `"BookStore" <${EMAIL_USER}>`,
    to: to.trim(),
    subject: subject.trim(),
    text,
    html,
  });
};

export default sendEmail;
