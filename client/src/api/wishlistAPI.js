import api from "./axios";

// ==========================================
// Get Wishlist
// ==========================================

export const getWishlist = async () => {
  const response = await api.get("/wishlist");

  return response.data;
};

// ==========================================
// Add Book to Wishlist
// ==========================================

export const addToWishlist = async (bookId) => {
  const response = await api.post("/wishlist/add", {
    bookId,
  });

  return response.data;
};

// ==========================================
// Remove Book from Wishlist
// ==========================================

export const removeFromWishlist = async (bookId) => {
  const response = await api.delete(`/wishlist/remove/${bookId}`);

  return response.data;
};

// ==========================================
// Clear Wishlist
// ==========================================

export const clearWishlist = async () => {
  const response = await api.delete("/wishlist/clear");

  return response.data;
};
