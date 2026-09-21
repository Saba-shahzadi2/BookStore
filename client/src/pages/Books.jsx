import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

import { getBooks } from "../api/booksAPI";
import SEO from "../components/SEO";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBooks({
        search: search.trim(),
        category,
        limit: 12,
      });

      setBooks(Array.isArray(data?.books) ? data.books : []);
    } catch (err) {
      console.error("Books Error:", err);

      const errorMessage =
        err.response?.data?.message ||
        "Unable to load books. Please try again.";

      setError(errorMessage);
      setBooks([]);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Category changes should immediately refresh the book list.
    // Search is intentionally submitted separately through the form.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
  };

  const categories = [
    ...new Set(books.map((book) => book?.category).filter(Boolean)),
  ];

  const hasFilters = search.trim() || category;

  return (
    <main className="min-h-screen bg-slate-50">
      <SEO
        title="Books Collection | Browse & Shop Books | BookStore"
        description="Browse and shop books online at BookStore. Search by title or author, explore categories, discover new books, and find your next great read."
      />

      {/* Page Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-600">
              Explore our collection
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
              Discover Your Next Book
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Browse our collection of carefully selected books and find your
              next great read.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <FiSliders size={17} aria-hidden="true" />
            <span>Find a book</span>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <form
              onSubmit={handleSearch}
              className="flex min-w-0 flex-1 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm transition focus-within:border-slate-500 focus-within:ring-2 focus-within:ring-slate-950/5"
            >
              <label htmlFor="book-search" className="sr-only">
                Search books
              </label>

              <div className="flex min-w-0 flex-1 items-center">
                <FiSearch
                  size={18}
                  className="ml-4 shrink-0 text-slate-400"
                  aria-hidden="true"
                />

                <input
                  id="book-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title or author..."
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 outline-none placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex shrink-0 items-center justify-center gap-2 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
              >
                <FiSearch size={17} aria-hidden="true" />
                Search
              </button>
            </form>

            <label className="lg:w-56">
              <span className="sr-only">Filter books by category</span>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-950/5"
              >
                <option value="">All Categories</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            {hasFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
              >
                <FiX size={17} aria-hidden="true" />
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Books */}
      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              role="status"
              aria-live="polite"
              aria-label="Loading books"
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="h-72 animate-pulse bg-slate-200 sm:h-80" />

                  <div className="space-y-3 p-5">
                    <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                    <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-2/5 animate-pulse rounded bg-slate-200" />
                    <div className="mt-5 h-6 w-1/3 animate-pulse rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-xl rounded-2xl border border-red-100 bg-red-50 p-6 text-center"
              role="alert"
            >
              <h2 className="font-semibold text-red-800">
                Unable to load books
              </h2>

              <p className="mt-2 text-sm leading-6 text-red-600">{error}</p>

              <button
                type="button"
                onClick={fetchBooks}
                className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600/20"
              >
                Try Again
              </button>
            </motion.div>
          ) : books.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-xl py-16 text-center sm:py-20"
              role="status"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <FiSearch
                  size={24}
                  className="text-slate-500"
                  aria-hidden="true"
                />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No books found
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Try a different search term or choose another category.
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20"
                >
                  <FiX size={16} aria-hidden="true" />
                  Clear Filters
                </button>
              )}
            </motion.div>
          ) : (
            <>
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Our Collection
                  </h2>

                  <p className="text-sm text-slate-500">
                    Showing {books.length}{" "}
                    {books.length === 1 ? "book" : "books"}
                  </p>
                </div>

                {hasFilters && (
                  <p className="text-sm text-slate-500">Filtered results</p>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {books.map((book, index) => {
                  const price = Math.max(0, Number(book?.price) || 0);
                  const stock = Math.max(0, Number(book?.stock) || 0);

                  return (
                    <motion.article
                      key={book._id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: Math.min(index * 0.04, 0.2),
                      }}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <Link
                        to={`/books/${book._id}`}
                        aria-label={`View ${book.title}`}
                        className="block overflow-hidden bg-slate-100"
                      >
                        <img
                          src={
                            book.coverImage ||
                            "https://via.placeholder.com/400x500?text=Book"
                          }
                          alt={book.title || "Book cover"}
                          loading="lazy"
                          className="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:h-80"
                        />
                      </Link>

                      <div className="p-5">
                        {book.category && (
                          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                            {book.category}
                          </p>
                        )}

                        <Link
                          to={`/books/${book._id}`}
                          className="block focus:outline-none"
                        >
                          <h2 className="mt-2 line-clamp-2 text-lg font-bold leading-6 text-slate-950 transition group-hover:text-amber-600">
                            {book.title || "Untitled Book"}
                          </h2>
                        </Link>

                        <p className="mt-1 truncate text-sm text-slate-500">
                          by {book.author || "Unknown Author"}
                        </p>

                        <div className="mt-5 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Price
                            </p>

                            <span className="text-xl font-bold text-slate-950">
                              ${price.toFixed(2)}
                            </span>
                          </div>

                          <span
                            className={`text-right text-xs font-semibold ${
                              stock > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {stock > 0 ? `${stock} in stock` : "Out of stock"}
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Books;
