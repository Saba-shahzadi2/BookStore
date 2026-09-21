import api from "./axios";

// ============================================================
// Dashboard
// ============================================================

export const getAdminStats = async () => {
  const response = await api.get("/admin/stats");

  return response.data;
};

// ============================================================
// Users
// ============================================================

export const getAllUsers = async (params = {}) => {
  const response = await api.get("/admin/users", {
    params,
  });

  return response.data;
};

// ============================================================
// Orders
// ============================================================

export const getAllOrders = async (params = {}) => {
  const response = await api.get("/admin/orders", {
    params,
  });

  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/admin/orders/${orderId}/status`, {
    status,
  });

  return response.data;
};

// ============================================================
// Contact Messages
// ============================================================

export const getAllContactMessages = async (params = {}) => {
  const response = await api.get("/admin/messages", {
    params,
  });

  return response.data;
};

export const getContactMessageById = async (messageId) => {
  const response = await api.get(`/admin/messages/${messageId}`);

  return response.data;
};

export const updateContactMessageStatus = async (messageId, status) => {
  const response = await api.put(`/admin/messages/${messageId}/status`, {
    status,
  });

  return response.data;
};

export const deleteContactMessage = async (messageId) => {
  const response = await api.delete(`/admin/messages/${messageId}`);

  return response.data;
};
