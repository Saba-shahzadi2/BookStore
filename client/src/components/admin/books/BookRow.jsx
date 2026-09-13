import { motion } from "framer-motion";
import { FiEdit2, FiRotateCcw, FiTrash2 } from "react-icons/fi";

const BookRow = ({
  book,
  onEdit,
  onDelete,
  onRestore,
  deletingId,
  restoringId,
}) => {
  const isDeleting = deletingId === book?._id;
  const isRestoring = restoringId === book?._id;

  const stock = Math.max(0, Number(book?.stock) || 0);
  const price = Math.max(0, Number(book?.price) || 0);
  const isActive = Boolean(book?.isActive);

  const imageUrl =
    book?.coverImage || "https://via.placeholder.com/64x80?text=Book";

  return (
    <>
      {/* Book */}
      <td className="px-6 py-4 align-middle">
        <div className="flex items-center gap-4">
          <motion.img
            src={imageUrl}
            alt={book?.title ? `${book.title} cover` : "Book cover"}
            loading="lazy"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className="h-16 w-12 shrink-0 rounded-lg border border-slate-200 bg-slate-50 object-contain shadow-sm"
          />

          <div className="min-w-0">
            <h3 className="max-w-xs truncate font-semibold text-slate-950">
              {book?.title || "Untitled Book"}
            </h3>

            <p className="mt-1 max-w-xs truncate text-sm text-slate-500">
              {book?.author || "Unknown Author"}
            </p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-6 py-4 align-middle text-sm text-slate-600">
        {book?.category || "—"}
      </td>

      {/* Price */}
      <td className="px-6 py-4 align-middle text-sm font-bold text-slate-950">
        ${price.toFixed(2)}
      </td>

      {/* Stock */}
      <td className="px-6 py-4 align-middle">
        <span
          className={
            stock > 0
              ? "text-sm font-semibold text-slate-700"
              : "text-sm font-bold text-red-600"
          }
        >
          {stock}
        </span>

        {stock === 0 && (
          <span className="ml-2 text-xs font-medium text-red-500">
            Out of stock
          </span>
        )}
      </td>

      {/* Status */}
      <td className="px-6 py-4 align-middle">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
            isActive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isActive ? "bg-emerald-500" : "bg-red-500"
            }`}
            aria-hidden="true"
          />

          {isActive ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 align-middle">
        <div className="flex justify-end gap-1.5">
          <motion.button
            type="button"
            onClick={() => onEdit(book)}
            disabled={isDeleting || isRestoring}
            whileTap={!isDeleting && !isRestoring ? { scale: 0.94 } : undefined}
            aria-label={`Edit ${book?.title || "book"}`}
            title="Edit book"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiEdit2 size={17} aria-hidden="true" />
          </motion.button>

          {isActive ? (
            <motion.button
              type="button"
              onClick={() => onDelete(book?._id)}
              disabled={isDeleting || isRestoring}
              whileTap={
                !isDeleting && !isRestoring ? { scale: 0.94 } : undefined
              }
              aria-label={`Delete ${book?.title || "book"}`}
              title="Delete book"
              className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiTrash2
                size={17}
                className={isDeleting ? "animate-pulse" : ""}
                aria-hidden="true"
              />
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={() => onRestore(book?._id)}
              disabled={isRestoring || isDeleting}
              whileTap={
                !isRestoring && !isDeleting ? { scale: 0.94 } : undefined
              }
              aria-label={`Restore ${book?.title || "book"}`}
              title="Restore book"
              className="rounded-lg p-2 text-emerald-600 transition hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiRotateCcw
                size={17}
                className={isRestoring ? "animate-spin" : ""}
                aria-hidden="true"
              />
            </motion.button>
          )}
        </div>
      </td>
    </>
  );
};

export default BookRow;
