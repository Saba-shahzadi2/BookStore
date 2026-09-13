import api from "./axios";

// ==========================================
// Get Cart
// ==========================================

export const getCart = async () => {
  const response = await api.get("/cart");

  return response.data;
};

// ==========================================
// Add to Cart
// ==========================================

export const addToCart = async (bookId, quantity = 1) => {
  const response = await api.post("/cart/add", {
    bookId,
    quantity,
  });

  return response.data;
};

// ==========================================
// Update Cart Item
// ==========================================

export const updateCartItem = async (bookId, quantity) => {
  const response = await api.put(`/cart/update/${bookId}`, {
    quantity,
  });

  return response.data;
};

// ==========================================
// Remove from Cart
// ==========================================

export const removeFromCart = async (bookId) => {
  const response = await api.delete(`/cart/remove/${bookId}`);

  return response.data;
};

// ==========================================
// Clear Cart
// ==========================================

export const clearCart = async () => {
  const response = await api.delete("/cart/clear");

  return response.data;
};
