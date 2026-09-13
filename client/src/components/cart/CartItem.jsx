import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const book = item?.book;

  if (!book) {
    return null;
  }

  const quantity = Math.max(
    1,
    Number.isInteger(Number(item?.quantity)) ? Number(item.quantity) : 1,
  );

  const price = Math.max(0, Number(book?.price) || 0);
  const stock = Math.max(0, Number(book?.stock) || 0);
  const itemTotal = price * quantity;

  const imageUrl =
    book.coverImage || "https://via.placeholder.com/180x240?text=Book";

  const isMaxQuantity = stock > 0 && quantity >= stock;
  const isOutOfStock = stock <= 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-5"
    >
      <div className="flex flex-col gap-5 sm:flex-row">
        {/* Book Cover */}
        <Link
          to={`/books/${book._id}`}
          className="group mx-auto w-full max-w-[180px] shrink-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-950/20 sm:mx-0 sm:w-32"
          aria-label={`View ${book.title || "book"}`}
        >
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <img
              src={imageUrl}
              alt={book.title ? `${book.title} book cover` : "Book cover"}
              loading="lazy"
              className="h-52 w-full object-contain p-2 transition duration-300 group-hover:scale-[1.03] sm:h-40"
            />
          </div>
        </Link>

        {/* Book Information */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-1 justify-between gap-4">
            <div className="min-w-0">
              {book.category && (
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-600">
                  {book.category}
                </p>
              )}

              <Link
                to={`/books/${book._id}`}
                className="rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-950/20"
              >
                <h2 className="mt-1 line-clamp-2 text-lg font-bold leading-snug text-slate-950 transition-colors hover:text-amber-600 sm:text-xl">
                  {book.title || "Untitled Book"}
                </h2>
              </Link>

              {book.author && (
                <p className="mt-1 text-sm text-slate-500">by {book.author}</p>
              )}
            </div>

            {/* Remove */}
            <button
              type="button"
              onClick={() => onRemove(book._id)}
              className="h-fit shrink-0 rounded-xl p-2.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              aria-label={`Remove ${book.title || "book"} from cart`}
            >
              <FiTrash2 size={18} aria-hidden="true" />
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Quantity
              </p>

              <div
                className="flex w-fit items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                aria-label={`Quantity: ${quantity}`}
              >
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => onQuantityChange(book._id, quantity - 1)}
                  className="flex h-10 w-10 items-center justify-center text-slate-600 transition hover:bg-white hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-950/10 disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label={`Decrease quantity of ${book.title || "book"}`}
                >
                  <FiMinus size={15} aria-hidden="true" />
                </button>

                <span
                  className="flex h-10 min-w-11 items-center justify-center border-x border-slate-200 bg-white px-2 text-sm font-bold text-slate-900"
                  aria-live="polite"
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  disabled={isOutOfStock || isMaxQuantity}
                  onClick={() => onQuantityChange(book._id, quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center text-slate-600 transition hover:bg-white hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-950/10 disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label={`Increase quantity of ${book.title || "book"}`}
                >
                  <FiPlus size={15} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="sm:text-right">
              <p className="text-xl font-bold tracking-tight text-slate-950">
                ${itemTotal.toFixed(2)}
              </p>

              <p className="mt-0.5 text-xs text-slate-400">
                ${price.toFixed(2)} each
              </p>
            </div>
          </div>

          {/* Stock Messages */}
          {isMaxQuantity && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-xs font-medium text-amber-600"
              role="status"
            >
              Maximum available quantity reached.
            </motion.p>
          )}

          {isOutOfStock && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-xs font-medium text-red-600"
              role="alert"
            >
              This book is currently out of stock.
            </motion.p>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default CartItem;
