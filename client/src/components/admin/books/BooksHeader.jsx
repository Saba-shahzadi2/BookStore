import { motion } from "framer-motion";
import { FiBookOpen, FiPlus } from "react-icons/fi";

const BooksHeader = ({ onAddBook }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-600">
          <FiBookOpen size={14} aria-hidden="true" />
          <span>Management</span>
        </div>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          Books
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
          Manage your bookstore inventory, book details, and availability.
        </p>
      </div>

      <motion.button
        type="button"
        onClick={onAddBook}
        whileTap={{ scale: 0.98 }}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20 sm:w-auto"
      >
        <FiPlus size={18} aria-hidden="true" />
        <span>Add New Book</span>
      </motion.button>
    </motion.div>
  );
};

export default BooksHeader;
