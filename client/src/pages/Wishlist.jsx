import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiHeart, FiStar, FiTrash2, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

import { useWishlist } from "../context/useWishlist";
import { useAuth } from "../context/useAuth";
import SEO from "../components/SEO";

import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";

const Wishlist = () => {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const { wishlist, loading, removeFromWishlist, clearWishlist } =
    useWishlist();

  const [removingId, setRemovingId] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState("");

  const books = Array.isArray(wishlist) ? wishlist : [];

  const handleRemove = async (bookId) => {
    if (!bookId || removingId || clearing) return;

    try {
      setRemovingId(bookId);
      setError("");

      await removeFromWishlist(bookId);

      toast.success("Book removed from wishlist.");
    } catch (err) {
      console.error("Remove Wishlist Error:", err);

      if (err.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        navigate("/login", { replace: true });
        return;
      }

      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to remove this book.";

      setError(message);
      toast.error(message);
    } finally {
      setRemovingId(null);
    }
  };

  const handleClear = async () => {
    if (clearing || removingId || books.length === 0) return;

    const confirmed = window.confirm(
      "Are you sure you want to clear your wishlist?",
    );

    if (!confirmed) return;

    try {
      setClearing(true);
      setError("");

      await clearWishlist();

      toast.success("Wishlist cleared successfully.");
    } catch (err) {
      console.error("Clear Wishlist Error:", err);

      if (err.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        navigate("/login", { replace: true });
        return;
      }

      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to clear your wishlist.";

      setError(message);
      toast.error(message);
    } finally {
      setClearing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6">
        <SEO
          title="My Wishlist | BookStore"
          description="View and manage your saved books and keep track of the books you want to read later."
          noindex
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-red-100 bg-red-50">
            <FiHeart size={30} className="text-red-500" aria-hidden="true" />
          </div>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
            Your wishlist
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Login Required
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
            Please login to view and manage your saved books.
          </p>

          <Link
            to="/login"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20"
          >
            Login
            <FiArrowRight size={17} aria-hidden="true" />
          </Link>
        </motion.div>
      </main>
    );
  }

  if (loading) {
    return <Loader text="Loading your wishlist..." fullScreen />;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <SEO
        title="My Wishlist | BookStore"
        description="View and manage your saved books and keep track of the books you want to read later."
        noindex
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
        >
          <div>
            <div className="flex items-center gap-2">
              <FiHeart size={18} className="text-red-500" aria-hidden="true" />

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600 sm:text-sm">
                Your saved books
              </p>
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              My Wishlist
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              {books.length} {books.length === 1 ? "book" : "books"} saved for
              later.
            </p>
          </div>

          {books.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              disabled={clearing || Boolean(removingId)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {clearing ? (
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-500"
                  aria-hidden="true"
                />
              ) : (
                <FiTrash2 size={16} aria-hidden="true" />
              )}

              {clearing ? "Clearing..." : "Clear Wishlist"}
            </button>
          )}
        </motion.div>

        {/* Persistent Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-7"
          >
            <ErrorMessage title="Wishlist Error" message={error} />
          </motion.div>
        )}

        {/* Empty Wishlist */}
        {books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <EmptyState
              title="Your wishlist is empty"
              message="You haven't added any books to your wishlist yet. Explore our collection and save the books you love."
              icon="wishlist"
              action={
                <Link
                  to="/books"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20"
                >
                  Explore Books
                  <FiArrowRight size={17} aria-hidden="true" />
                </Link>
              }
            />
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book, index) => {
              const isRemoving = removingId === book?._id;
              const stock = Math.max(0, Number(book?.stock) || 0);
              const isOutOfStock = stock <= 0;
              const rating = Math.max(0, Number(book?.rating) || 0);
              const reviews = Math.max(0, Number(book?.numReviews) || 0);
              const price = Math.max(0, Number(book?.price) || 0);

              return (
                <motion.article
                  key={book?._id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(index * 0.05, 0.3),
                  }}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Book Cover */}
                  <div className="relative flex h-80 items-center justify-center overflow-hidden bg-slate-100 p-4">
                    <Link
                      to={`/books/${book?._id}`}
                      className="flex h-full w-full items-center justify-center focus:outline-none focus:ring-2 focus:ring-slate-950/20"
                    >
                      <img
                        src={
                          book?.coverImage ||
                          "https://via.placeholder.com/400x500?text=Book"
                        }
                        alt={
                          book?.title
                            ? `${book.title} book cover`
                            : "Book cover"
                        }
                        loading="lazy"
                        className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]"
                      />
                    </Link>

                    {/* Remove Icon */}
                    <button
                      type="button"
                      onClick={() => handleRemove(book?._id)}
                      disabled={isRemoving || clearing}
                      aria-label={`Remove ${
                        book?.title || "book"
                      } from wishlist`}
                      className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-red-500 shadow-sm backdrop-blur transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isRemoving ? (
                        <span
                          className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-500"
                          role="status"
                          aria-label="Removing"
                        />
                      ) : (
                        <FiX size={19} aria-hidden="true" />
                      )}
                    </button>

                    {/* Stock */}
                    <div className="absolute bottom-3 left-3">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${
                          isOutOfStock
                            ? "bg-red-50 text-red-600 ring-1 ring-inset ring-red-200"
                            : "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200"
                        }`}
                      >
                        {isOutOfStock ? "Out of Stock" : `${stock} in stock`}
                      </span>
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-600">
                      {book?.category || "Book"}
                    </p>

                    <Link
                      to={`/books/${book?._id}`}
                      className="mt-2 block rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-950/20"
                    >
                      <h2 className="line-clamp-2 text-lg font-bold leading-6 text-slate-950 transition hover:text-amber-600">
                        {book?.title || "Untitled Book"}
                      </h2>
                    </Link>

                    <p className="mt-1 truncate text-sm text-slate-500">
                      by {book?.author || "Unknown Author"}
                    </p>

                    {/* Rating */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-950">
                        <FiStar
                          size={14}
                          className="text-amber-500"
                          fill="currentColor"
                          aria-hidden="true"
                        />
                        {rating.toFixed(1)}
                      </span>

                      <span className="text-xs text-slate-400">
                        ({reviews} {reviews === 1 ? "review" : "reviews"})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-xl font-bold text-slate-950">
                        ${price.toFixed(2)}
                      </span>

                      <Link
                        to={`/books/${book?._id}`}
                        className="inline-flex items-center gap-1 rounded-sm text-sm font-semibold text-slate-700 transition hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      >
                        Details
                        <FiArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => handleRemove(book?._id)}
                      disabled={isRemoving || clearing}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isRemoving ? (
                        <span
                          className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-red-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <FiTrash2 size={16} aria-hidden="true" />
                      )}

                      {isRemoving ? "Removing..." : "Remove from Wishlist"}
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default Wishlist;
