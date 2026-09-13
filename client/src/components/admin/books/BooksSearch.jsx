import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";

const BooksSearch = ({ search, onSearchChange, onSubmit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 sm:flex-row"
        role="search"
      >
        <div className="relative min-w-0 flex-1">
          <FiSearch
            size={19}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />

          <label htmlFor="book-search" className="sr-only">
            Search books by title or author
          </label>

          <input
            id="book-search"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by title or author..."
            autoComplete="off"
            spellCheck="false"
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
          />
        </div>

        <motion.button
          type="submit"
          whileTap={{ scale: 0.98 }}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20"
        >
          <FiSearch size={17} aria-hidden="true" />
          <span>Search</span>
        </motion.button>
      </form>
    </motion.div>
  );
};

export default BooksSearch;
