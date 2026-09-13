import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiHeart,
  FiShoppingCart,
  FiXCircle,
} from "react-icons/fi";

import { useAuth } from "../../context/useAuth";
import { useCart } from "../../context/useCart";
import { useWishlist } from "../../context/useWishlist";

const BookActions = ({ book }) => {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [adding, setAdding] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");

  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [wishlistError, setWishlistError] = useState("");

  const stock = Math.max(0, Number(book?.stock) || 0);
  const isOutOfStock = stock <= 0;

  const inWishlist = book?._id ? isInWishlist(book._id) : false;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!book?._id || isOutOfStock) {
      return;
    }

    try {
      setAdding(true);
      setCartMessage("");
      setCartError("");

      await addToCart(book._id, 1);

      setCartMessage("Book added to cart successfully.");
    } catch (err) {
      console.error("Add to Cart Error:", err);

      setCartError(
        err.response?.data?.message ||
          err.message ||
          "Unable to add book to cart.",
      );
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!book?._id) {
      return;
    }

    try {
      setWishlistLoading(true);
      setWishlistMessage("");
      setWishlistError("");

      if (inWishlist) {
        await removeFromWishlist(book._id);
        setWishlistMessage("Book removed from wishlist.");
      } else {
        await addToWishlist(book._id);
        setWishlistMessage("Book added to wishlist.");
      }
    } catch (err) {
      console.error("Wishlist Error:", err);

      setWishlistError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update wishlist.",
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.35 }}
      className="mt-8 border-t border-slate-100 pt-7"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <motion.button
          type="button"
          onClick={handleAddToCart}
          disabled={adding || isOutOfStock}
          whileHover={!adding && !isOutOfStock ? { y: -1 } : undefined}
          whileTap={!adding && !isOutOfStock ? { scale: 0.98 } : undefined}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiShoppingCart size={19} aria-hidden="true" />

          {adding ? "Adding..." : isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </motion.button>

        <motion.button
          type="button"
          onClick={handleWishlist}
          disabled={wishlistLoading}
          whileHover={!wishlistLoading ? { y: -1 } : undefined}
          whileTap={!wishlistLoading ? { scale: 0.98 } : undefined}
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-6 py-3.5 font-semibold transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none ${
            inWishlist
              ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500/20"
              : "border-slate-300 bg-white text-slate-700 hover:border-slate-950 hover:text-slate-950 focus:ring-slate-950/10"
          }`}
        >
          <FiHeart
            size={19}
            fill={inWishlist ? "currentColor" : "none"}
            aria-hidden="true"
          />

          {wishlistLoading
            ? "Updating..."
            : inWishlist
              ? "Remove from Wishlist"
              : "Add to Wishlist"}
        </motion.button>
      </div>

      <div className="mt-4 space-y-3" aria-live="polite" aria-atomic="true">
        {cartMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
            role="status"
          >
            <FiCheckCircle size={17} aria-hidden="true" />
            {cartMessage}
          </motion.div>
        )}

        {cartError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            role="alert"
          >
            <FiXCircle size={17} aria-hidden="true" />
            {cartError}
          </motion.div>
        )}

        {wishlistMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
            role="status"
          >
            <FiCheckCircle size={17} aria-hidden="true" />
            {wishlistMessage}
          </motion.div>
        )}

        {wishlistError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            role="alert"
          >
            <FiXCircle size={17} aria-hidden="true" />
            {wishlistError}
          </motion.div>
        )}
      </div>

      {inWishlist && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4"
        >
          <Link
            to="/wishlist"
            className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600 transition hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          >
            View your wishlist
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BookActions;
