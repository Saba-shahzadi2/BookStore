import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiBookOpen, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

import SEO from "../components/SEO";
import { useCart } from "../context/useCart";

import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";

import EmptyState from "../components/common/EmptyState";
import Loader from "../components/common/Loader";

const Cart = () => {
  const {
    cart,
    loading,
    cartTotal,
    updateCartItem,
    removeFromCart,
    clearCart,
  } = useCart();

  const [clearing, setClearing] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);

  const items = Array.isArray(cart) ? cart : [];

  const handleQuantityChange = async (bookId, quantity) => {
    const parsedQuantity = Number(quantity);

    if (!bookId || !Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      return;
    }

    try {
      setUpdatingItemId(bookId);

      await updateCartItem(bookId, parsedQuantity);
    } catch (err) {
      console.error("Update Cart Error:", err.response?.data || err.message);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to update cart quantity.";

      toast.error(message);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemove = async (bookId) => {
    if (!bookId || removingItemId || clearing) return;

    try {
      setRemovingItemId(bookId);

      await removeFromCart(bookId);

      toast.success("Book removed from cart.");
    } catch (err) {
      console.error("Remove Cart Error:", err.response?.data || err.message);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to remove this book from cart.";

      toast.error(message);
    } finally {
      setRemovingItemId(null);
    }
  };

  const handleClearCart = async () => {
    if (clearing || items.length === 0) return;

    const confirmed = window.confirm(
      "Are you sure you want to clear your cart?",
    );

    if (!confirmed) return;

    try {
      setClearing(true);

      await clearCart();

      toast.success("Cart cleared successfully.");
    } catch (err) {
      console.error("Clear Cart Error:", err.response?.data || err.message);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to clear your cart.";

      toast.error(message);
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return <Loader text="Loading your cart..." fullScreen />;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <SEO
        title="Your Cart | BookStore"
        description="Review your selected books and manage your shopping cart before checkout."
        noindex
      />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 sm:mb-10"
        >
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-600 sm:text-sm">
            <FiShoppingBag size={16} aria-hidden="true" />
            Shopping Bag
          </div>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Your Cart
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Review your selected books and manage your items before
                checkout.
              </p>
            </div>

            {items.length > 0 && (
              <button
                type="button"
                onClick={handleClearCart}
                disabled={clearing || Boolean(removingItemId)}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {clearing ? (
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-500"
                    aria-hidden="true"
                  />
                ) : (
                  <FiTrash2 size={15} aria-hidden="true" />
                )}

                {clearing ? "Clearing..." : "Clear Cart"}
              </button>
            )}
          </div>
        </motion.div>

        {/* Cart Content */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <EmptyState
              icon="shopping"
              title="Your cart is empty"
              message="Discover a great book and add it to your cart."
              action={
                <Link
                  to="/books"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20"
                >
                  <FiBookOpen size={16} aria-hidden="true" />
                  Browse Books
                </Link>
              }
            />
          </motion.div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
            {/* Cart Items */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="min-w-0 space-y-4"
            >
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-5">
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    Cart Items
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {items.length} {items.length === 1 ? "item" : "items"} in
                    your cart
                  </p>
                </div>

                <FiShoppingBag
                  size={18}
                  className="text-slate-400"
                  aria-hidden="true"
                />
              </div>

              {items.map((item) => {
                const itemId = item.book?._id || item._id;

                return (
                  <motion.div
                    key={itemId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={
                      updatingItemId === itemId || removingItemId === itemId
                        ? "opacity-70 transition-opacity"
                        : "transition-opacity"
                    }
                  >
                    <CartItem
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemove}
                    />
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Cart Summary */}
            <motion.aside
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <CartSummary subtotal={cartTotal} />
            </motion.aside>
          </div>
        )}
      </section>
    </main>
  );
};

export default Cart;
