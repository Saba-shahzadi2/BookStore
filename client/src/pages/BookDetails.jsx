import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";

import { getBookById } from "../api/booksAPI";
import SEO from "../components/SEO";

import BookCover from "../components/books/BookCover";
import BookInfo from "../components/books/BookInfo";
import BookActions from "../components/books/BookActions";

import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";

const BookDetails = () => {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getBookById(id);

        if (!data?.success || !data?.book) {
          throw new Error("Book not found.");
        }

        setBook(data.book);
      } catch (err) {
        console.error("Book Details Error:", err);

        setBook(null);

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Unable to load this book. Please try again.";

        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  if (loading) {
    return <Loader text="Loading book..." fullScreen />;
  }

  if (error || !book) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md text-center"
        >
          <ErrorMessage
            title="Unable to Load Book"
            message={error || "This book is no longer available."}
          />

          <Link
            to="/books"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20"
          >
            <FiArrowLeft size={17} aria-hidden="true" />
            Back to Books
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <>
      <SEO
        title={`${book.title} | BookStore`}
        description={
          book.description ||
          `Explore ${book.title} by ${book.author} at BookStore.`
        }
      />

      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to="/books"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
            >
              <FiArrowLeft size={17} aria-hidden="true" />
              Back to Books
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mt-7 grid gap-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 md:grid-cols-2 md:gap-10 md:p-10 lg:gap-14"
          >
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="flex items-start justify-center"
            >
              <BookCover book={book} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="flex min-w-0 flex-col justify-center"
            >
              <BookInfo book={book} />

              <div className="mt-7 border-t border-slate-100 pt-7">
                <BookActions book={book} />
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </>
  );
};

export default BookDetails;
