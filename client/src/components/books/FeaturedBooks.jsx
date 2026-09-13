import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiBookOpen, FiStar } from "react-icons/fi";
import toast from "react-hot-toast";

import { getBooks } from "../../api/booksAPI";

const FeaturedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getBooks({
          featured: true,
          limit: 6,
        });

        setBooks(Array.isArray(data?.books) ? data.books : []);
      } catch (err) {
        console.error("Featured Books Error:", err);

        const message =
          err.response?.data?.message || "Unable to load featured books.";

        setError(message);
        setBooks([]);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-600 sm:text-sm">
              Discover your next read
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Featured Books
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Explore some of our featured books and find your next great read.
            </p>
          </div>

          <Link
            to="/books"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
          >
            View all books
            <FiArrowRight size={17} aria-hidden="true" />
          </Link>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            role="status"
            aria-label="Loading featured books"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="h-72 animate-pulse bg-slate-200" />

                <div className="space-y-3 p-5">
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                  <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-2/5 animate-pulse rounded bg-slate-200" />
                  <div className="mt-5 h-6 w-1/3 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-red-100 bg-red-50 px-6 py-8 text-center"
            role="alert"
          >
            <h3 className="font-semibold text-red-800">
              Unable to load featured books
            </h3>

            <p className="mt-2 text-sm text-red-600">{error}</p>
          </motion.div>
        )}

        {/* Empty */}
        {!loading && !error && books.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm"
            role="status"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <FiBookOpen
                size={24}
                className="text-slate-500"
                aria-hidden="true"
              />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-950">
              No featured books available
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Check back soon for our featured collection.
            </p>
          </motion.div>
        )}

        {/* Books */}
        {!loading && !error && books.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book, index) => {
              const price = Math.max(0, Number(book?.price) || 0);
              const stock = Math.max(0, Number(book?.stock) || 0);
              const rating = Math.max(0, Number(book?.rating) || 0);
              const reviewCount = Math.max(0, Number(book?.numReviews) || 0);

              return (
                <motion.article
                  key={book._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.06, 0.3),
                  }}
                  whileHover={{ y: -4 }}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
                >
                  {/* Cover */}
                  <Link
                    to={`/books/${book._id}`}
                    className="block overflow-hidden bg-slate-100"
                    aria-label={`View ${book?.title || "book"}`}
                  >
                    <img
                      src={
                        book?.coverImage ||
                        "https://via.placeholder.com/400x500?text=Book"
                      }
                      alt={book?.title || "Book cover"}
                      loading="lazy"
                      className="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  </Link>

                  {/* Content */}
                  <div className="p-5">
                    {book?.category && (
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                        {book.category}
                      </p>
                    )}

                    <Link
                      to={`/books/${book._id}`}
                      className="block focus:outline-none"
                    >
                      <h3 className="mt-2 line-clamp-2 text-xl font-bold leading-6 text-slate-950 transition group-hover:text-amber-600">
                        {book?.title || "Untitled Book"}
                      </h3>
                    </Link>

                    <p className="mt-1 truncate text-sm text-slate-500">
                      by {book?.author || "Unknown Author"}
                    </p>

                    {/* Rating */}
                    {reviewCount > 0 && (
                      <div className="mt-4 flex items-center gap-2">
                        <div className="flex items-center gap-1 text-amber-500">
                          <FiStar
                            size={16}
                            fill="currentColor"
                            aria-hidden="true"
                          />

                          <span className="text-sm font-semibold text-slate-800">
                            {rating.toFixed(1)}
                          </span>
                        </div>

                        <span className="text-xs text-slate-400">
                          ({reviewCount}{" "}
                          {reviewCount === 1 ? "review" : "reviews"})
                        </span>
                      </div>
                    )}

                    {/* Price / Stock */}
                    <div className="mt-5 flex items-end justify-between gap-4 border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Price
                        </p>

                        <p className="mt-0.5 text-xl font-bold text-slate-950">
                          ${price.toFixed(2)}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          stock > 0
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {stock > 0 ? `${stock} in stock` : "Out of stock"}
                      </span>
                    </div>

                    {/* Details Link */}
                    <Link
                      to={`/books/${book._id}`}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-950/10"
                    >
                      View Details
                      <FiArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedBooks;
