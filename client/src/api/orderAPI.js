import api from "./axios";

// ==========================================
// Create Order
// ==========================================

export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);

  return response.data;
};

// ==========================================
// Get My Orders
// ==========================================

export const getMyOrders = async () => {
  const response = await api.get("/orders/my-orders");

  return response.data;
};

// ==========================================
// Get Single Order
// ==========================================

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);

  return response.data;
};

// ==========================================
// Cancel Order
// ==========================================

export const cancelOrder = async (id) => {
  const response = await api.put(`/orders/${id}/cancel`);

  return response.data;
};
