import api from "./axios";

// ==========================================
// Public Books
// ==========================================

export const getBooks = async (params = {}) => {
  const response = await api.get("/books", {
    params,
  });

  return response.data;
};

export const getBookById = async (id) => {
  const response = await api.get(`/books/${id}`);

  return response.data;
};

// ==========================================
// Admin Books
// ==========================================

export const getAdminBooks = async (params = {}) => {
  const response = await api.get("/books/admin/all", {
    params,
  });

  return response.data;
};

export const createBook = async (bookData) => {
  const response = await api.post("/books", bookData);

  return response.data;
};

export const updateBook = async (id, bookData) => {
  const response = await api.put(`/books/${id}`, bookData);

  return response.data;
};

export const deleteBook = async (id) => {
  const response = await api.delete(`/books/${id}`);

  return response.data;
};

// Restore book - Admin
export const restoreBook = async (id) => {
  const response = await api.put(`/books/admin/${id}/restore`);

  return response.data;
};
