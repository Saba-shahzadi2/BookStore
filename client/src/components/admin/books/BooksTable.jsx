import { motion } from "framer-motion";
import { FiBook, FiLoader } from "react-icons/fi";

import BookRow from "./BookRow";

const BooksTable = ({
  books = [],
  loading,
  total = 0,
  onEdit,
  onDelete,
  onRestore,
  deletingId,
  restoringId,
}) => {
  const bookList = Array.isArray(books) ? books : [];
  const totalBooks = Math.max(0, Number(total) || 0);

  if (loading) {
    return (
      <div
        className="flex min-h-[300px] items-center justify-center px-6"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center">
          <FiLoader
            size={28}
            className="animate-spin text-slate-700"
            aria-hidden="true"
          />

          <p className="mt-3 text-sm font-medium text-slate-500">
            Loading books...
          </p>
        </div>
      </div>
    );
  }

  if (bookList.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex min-h-[300px] flex-col items-center justify-center px-6 py-10 text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
          <FiBook size={28} className="text-slate-400" aria-hidden="true" />
        </div>

        <h3 className="mt-4 text-base font-bold text-slate-950">
          No books found
        </h3>

        <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
          Try another search term or add a new book to your inventory.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Table Header */}
      <div className="border-b border-slate-200 px-4 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100"
            aria-hidden="true"
          >
            <FiBook size={18} className="text-slate-700" />
          </div>

          <div className="min-w-0">
            <h2 className="font-bold text-slate-950">All Books</h2>

            <p className="mt-0.5 text-sm text-slate-500">
              {totalBooks.toLocaleString()}{" "}
              {totalBooks === 1 ? "book" : "books"} in inventory
            </p>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <table
        className="w-full min-w-[900px] border-collapse"
        aria-label="Book inventory"
      >
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
            <th scope="col" className="px-6 py-4">
              Book
            </th>

            <th scope="col" className="px-6 py-4">
              Category
            </th>

            <th scope="col" className="px-6 py-4">
              Price
            </th>

            <th scope="col" className="px-6 py-4">
              Stock
            </th>

            <th scope="col" className="px-6 py-4">
              Status
            </th>

            <th scope="col" className="px-6 py-4 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {bookList.map((book, index) => (
            <motion.tr
              key={book._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.25,
                delay: Math.min(index * 0.03, 0.25),
              }}
              className="transition-colors hover:bg-slate-50/70"
            >
              <BookRow
                book={book}
                onEdit={onEdit}
                onDelete={onDelete}
                onRestore={onRestore}
                deletingId={deletingId}
                restoringId={restoringId}
              />
            </motion.tr>
          ))}
        </tbody>
      </table>

      {/* Mobile scroll hint */}
      <div className="border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-center text-xs text-slate-400 sm:hidden">
        Swipe horizontally to view all columns
      </div>
    </div>
  );
};

export default BooksTable;
