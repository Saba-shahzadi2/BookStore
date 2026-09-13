import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// Request Interceptor
// ==========================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("bookstore_token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ==========================================
// Response Interceptor
// ==========================================

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error?.response?.status;

    // Remove authentication data when the token
    // is invalid or expired.
    if (status === 401) {
      localStorage.removeItem("bookstore_token");
      localStorage.removeItem("bookstore_user");
    }

    return Promise.reject(error);
  },
);

export default api;
