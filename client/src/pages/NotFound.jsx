import { motion } from "framer-motion";
import { FiArrowLeft, FiBookOpen, FiHome } from "react-icons/fi";
import { Link } from "react-router-dom";

import SEO from "../components/SEO";

const NotFound = () => {
  return (
    <>
      <SEO
        title="Page Not Found | BookStore"
        description="The page you are looking for could not be found. Return to BookStore home or browse our collection of books."
        noindex
      />

      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-xl text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <FiBookOpen
              size={34}
              className="text-slate-700"
              aria-hidden="true"
            />
          </motion.div>

          {/* 404 */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-amber-600 sm:text-sm"
          >
            Page not found
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-2 text-7xl font-bold tracking-tight text-slate-950 sm:text-8xl"
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
          >
            This page doesn&apos;t exist
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-500 sm:text-base"
          >
            The page you&apos;re looking for may have been moved, deleted, or
            the URL may be incorrect.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
          >
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20"
            >
              <FiHome size={17} aria-hidden="true" />
              Back to Home
            </Link>

            <Link
              to="/books"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
            >
              <FiBookOpen size={17} aria-hidden="true" />
              Browse Books
            </Link>
          </motion.div>

          {/* Back hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="mt-8"
          >
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
            >
              <FiArrowLeft size={16} aria-hidden="true" />
              Go back to previous page
            </button>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
};

export default NotFound;
