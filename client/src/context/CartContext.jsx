import { useCallback, useEffect, useState } from "react";

import {
  getCart,
  addToCart as addToCartAPI,
  updateCartItem as updateCartItemAPI,
  removeFromCart as removeFromCartAPI,
  clearCart as clearCartAPI,
} from "../api/cartAPI";

import { useAuth } from "./useAuth";
import { CartContext } from "./CartContextDefinition";

export const CartProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();

  // ==========================================
  // State
  // ==========================================

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // Fetch Cart
  // ==========================================

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart([]);
      return;
    }

    try {
      setLoading(true);

      const data = await getCart();

      const cartItems = data?.cart?.items || [];

      setCart(Array.isArray(cartItems) ? cartItems : []);
    } catch (error) {
      console.error(
        "Failed to fetch cart:",
        error.response?.data || error.message,
      );

      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // ==========================================
  // Load Cart When Auth Is Ready
  // ==========================================

  useEffect(() => {
    if (authLoading) return;

    // The initial cart fetch intentionally starts from an effect
    // when authentication state becomes ready.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCart();
  }, [authLoading, fetchCart]);

  // ==========================================
  // Add To Cart
  // ==========================================

  const addToCart = async (bookId, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error("Please login to add items to cart");
    }

    try {
      const parsedQuantity = Number(quantity);

      if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
        throw new Error("Quantity must be a positive whole number");
      }

      const data = await addToCartAPI(bookId, parsedQuantity);

      await fetchCart();

      return data;
    } catch (error) {
      console.error(
        "Add to cart failed:",
        error.response?.data || error.message,
      );

      throw error;
    }
  };

  // ==========================================
  // Update Cart Item
  // ==========================================

  const updateCartItem = async (bookId, quantity) => {
    if (!isAuthenticated) {
      throw new Error("Please login to update cart");
    }

    try {
      const parsedQuantity = Number(quantity);

      if (!Number.isInteger(parsedQuantity)) {
        throw new Error("Quantity must be a whole number");
      }

      if (parsedQuantity < 1) {
        return removeFromCart(bookId);
      }

      const data = await updateCartItemAPI(bookId, parsedQuantity);

      await fetchCart();

      return data;
    } catch (error) {
      console.error(
        "Update cart failed:",
        error.response?.data || error.message,
      );

      throw error;
    }
  };

  // ==========================================
  // Remove From Cart
  // ==========================================

  const removeFromCart = async (bookId) => {
    if (!isAuthenticated) {
      throw new Error("Please login to remove item");
    }

    try {
      const data = await removeFromCartAPI(bookId);

      await fetchCart();

      return data;
    } catch (error) {
      console.error(
        "Remove from cart failed:",
        error.response?.data || error.message,
      );

      throw error;
    }
  };

  // ==========================================
  // Clear Cart
  // ==========================================

  const clearCart = async () => {
    if (!isAuthenticated) {
      setCart([]);
      return;
    }

    try {
      const data = await clearCartAPI();

      setCart([]);

      return data;
    } catch (error) {
      console.error(
        "Clear cart failed:",
        error.response?.data || error.message,
      );

      throw error;
    }
  };

  // ==========================================
  // Cart Count
  // ==========================================

  const cartCount = cart.reduce(
    (total, item) => total + Number(item?.quantity || 0),
    0,
  );

  // ==========================================
  // Cart Total
  // ==========================================

  const cartTotal = Number(
    cart
      .reduce((total, item) => {
        const price = Number(item?.book?.price) || 0;
        const quantity = Number(item?.quantity) || 0;

        return total + price * quantity;
      }, 0)
      .toFixed(2),
  );

  // ==========================================
  // Provider
  // ==========================================

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        cartTotal,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
