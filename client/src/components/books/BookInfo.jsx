import { motion } from "framer-motion";
import { FiBookOpen, FiCheckCircle, FiStar, FiXCircle } from "react-icons/fi";

const BookInfo = ({ book }) => {
  const rating = Math.max(0, Number(book?.rating) || 0);
  const reviewCount = Math.max(0, Number(book?.numReviews) || 0);
  const price = Math.max(0, Number(book?.price) || 0);
  const stock = Math.max(0, Number(book?.stock) || 0);

  const hasReviews = reviewCount > 0;
  const isInStock = stock > 0;

  return (
    <div className="flex flex-col">
      {/* Category */}
      {book?.category && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600 sm:text-sm"
        >
          {book.category}
        </motion.p>
      )}

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
      >
        {book?.title || "Untitled Book"}
      </motion.h1>

      {/* Author */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="mt-3 text-base text-slate-500 sm:text-lg"
      >
        by{" "}
        <span className="font-semibold text-slate-800">
          {book?.author || "Unknown Author"}
        </span>
      </motion.p>

      {/* Rating */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="mt-5"
      >
        {hasReviews ? (
          <div className="inline-flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-1.5 text-amber-500">
              <FiStar size={18} fill="currentColor" aria-hidden="true" />

              <span className="font-bold text-slate-900">
                {rating.toFixed(1)}
              </span>
            </div>

            <span className="h-4 w-px bg-slate-300" aria-hidden="true" />

            <span className="text-sm text-slate-500">
              {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            <FiStar size={17} aria-hidden="true" />
            <span>No reviews yet</span>
          </div>
        )}
      </motion.div>

      {/* Price */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="mt-7 border-y border-slate-100 py-6"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Price
        </p>

        <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          ${price.toFixed(2)}
        </p>
      </motion.div>

      {/* Description */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25 }}
        className="mt-7"
        aria-labelledby="book-description-heading"
      >
        <div className="flex items-center gap-2.5">
          <FiBookOpen size={19} className="text-slate-700" aria-hidden="true" />

          <h2
            id="book-description-heading"
            className="text-lg font-bold text-slate-950"
          >
            About this book
          </h2>
        </div>

        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          {book?.description || "No description available for this book."}
        </p>
      </motion.section>

      {/* Stock */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.3 }}
        className="mt-7"
      >
        {isInStock ? (
          <div
            className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 ring-1 ring-inset ring-green-200"
            role="status"
          >
            <FiCheckCircle size={17} aria-hidden="true" />
            {stock} {stock === 1 ? "copy" : "copies"} available
          </div>
        ) : (
          <div
            className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 ring-1 ring-inset ring-red-200"
            role="status"
          >
            <FiXCircle size={17} aria-hidden="true" />
            Out of stock
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BookInfo;
