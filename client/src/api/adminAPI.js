import api from "./axios";

// ==========================================
// Dashboard
// ==========================================

export const getAdminStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

// ==========================================
// Users
// ==========================================

export const getAllUsers = async (params = {}) => {
  const response = await api.get("/admin/users", {
    params,
  });

  return response.data;
};

// ==========================================
// Orders
// ==========================================

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
