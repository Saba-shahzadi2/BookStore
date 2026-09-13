import { useCallback, useEffect, useState } from "react";

import {
  getWishlist,
  addToWishlist as addToWishlistAPI,
  removeFromWishlist as removeFromWishlistAPI,
  clearWishlist as clearWishlistAPI,
} from "../api/wishlistAPI";

import { useAuth } from "./useAuth";
import { WishlistContext } from "./WishlistContextDefinition";

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();

  // ==========================================
  // State
  // ==========================================

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // Fetch Wishlist
  // ==========================================

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }

    try {
      setLoading(true);

      const data = await getWishlist();

      const wishlistBooks = data?.wishlist?.books || [];

      setWishlist(Array.isArray(wishlistBooks) ? wishlistBooks : []);
    } catch (error) {
      console.error(
        "Failed to fetch wishlist:",
        error.response?.data || error.message,
      );

      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // ==========================================
  // Load Wishlist When Auth Is Ready
  // ==========================================

  useEffect(() => {
    if (authLoading) return;

    // Initial wishlist fetch intentionally starts
    // after authentication state becomes ready.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWishlist();
  }, [authLoading, fetchWishlist]);

  // ==========================================
  // Add To Wishlist
  // ==========================================

  const addToWishlist = async (bookId) => {
    if (!isAuthenticated) {
      throw new Error("Please login to add items to wishlist");
    }

    if (!bookId) {
      throw new Error("Book ID is required");
    }

    try {
      const data = await addToWishlistAPI(bookId);

      await fetchWishlist();

      return data;
    } catch (error) {
      console.error(
        "Add to wishlist failed:",
        error.response?.data || error.message,
      );

      throw error;
    }
  };

  // ==========================================
  // Remove From Wishlist
  // ==========================================

  const removeFromWishlist = async (bookId) => {
    if (!isAuthenticated) {
      throw new Error("Please login to remove items from wishlist");
    }

    if (!bookId) {
      throw new Error("Book ID is required");
    }

    try {
      const data = await removeFromWishlistAPI(bookId);

      await fetchWishlist();

      return data;
    } catch (error) {
      console.error(
        "Remove from wishlist failed:",
        error.response?.data || error.message,
      );

      throw error;
    }
  };

  // ==========================================
  // Clear Wishlist
  // ==========================================

  const clearWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }

    try {
      const data = await clearWishlistAPI();

      setWishlist([]);

      return data;
    } catch (error) {
      console.error(
        "Clear wishlist failed:",
        error.response?.data || error.message,
      );

      throw error;
    }
  };

  // ==========================================
  // Wishlist Count
  // ==========================================

  const wishlistCount = wishlist.length;

  // ==========================================
  // Check Wishlist
  // ==========================================

  const isInWishlist = useCallback(
    (bookId) => {
      if (!bookId) return false;

      return wishlist.some((book) => {
        const wishlistBookId = book?._id || book?.book?._id || book;

        return String(wishlistBookId) === String(bookId);
      });
    },
    [wishlist],
  );

  // ==========================================
  // Provider
  // ==========================================

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        wishlistCount,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
