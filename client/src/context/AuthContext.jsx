import { useEffect, useState } from "react";
import { getMe } from "../api/authAPI";
import { AuthContext } from "./AuthContextDefinition";

const USER_STORAGE_KEY = "bookstore_user";
const TOKEN_STORAGE_KEY = "bookstore_token";

// ==========================================
// Get Stored User
// ==========================================

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Failed to load stored user:", error);

    localStorage.removeItem(USER_STORAGE_KEY);

    return null;
  }
};

// ==========================================
// Auth Provider
// ==========================================

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);

  // ========================================
  // Verify Authentication
  // ========================================

  useEffect(() => {
    const verifyAuthentication = async () => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await getMe();

        if (response?.success && response?.user) {
          setUser(response.user);

          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
        } else {
          throw new Error("Invalid authentication response");
        }
      } catch (error) {
        console.error("Authentication verification failed:", error);

        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuthentication();
  }, []);

  // ========================================
  // Login
  // ========================================

  const login = (userData, token) => {
    if (!userData || !token) {
      return;
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

    setUser(userData);
  };

  // ========================================
  // Logout
  // ========================================

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);

    setUser(null);
  };

  // ========================================
  // Context Value
  // ========================================

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: Boolean(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
