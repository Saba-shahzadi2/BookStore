import api from "./axios";

// ==========================================
// Register
// ==========================================

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);

  return response.data;
};

// ==========================================
// Login
// ==========================================

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  return response.data;
};

// ==========================================
// Get Current User
// ==========================================

export const getMe = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

// ==========================================
// Forgot Password - Send OTP
// ==========================================

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

// ==========================================
// Verify OTP
// ==========================================

export const verifyOTP = async (email, otp) => {
  const response = await api.post("/auth/verify-otp", {
    email,
    otp,
  });

  return response.data;
};

// ==========================================
// Resend OTP
// ==========================================

export const resendOTP = async (email) => {
  const response = await api.post("/auth/resend-otp", {
    email,
  });

  return response.data;
};

// ==========================================
// Reset Password
// ==========================================

export const resetPassword = async (token, password) => {
  const response = await api.post("/auth/reset-password", {
    token,
    password,
  });

  return response.data;
};
