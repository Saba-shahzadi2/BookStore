import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  createBook,
  deleteBook,
  getAdminBooks,
  restoreBook,
  updateBook,
} from "../../api/booksAPI";

import SEO from "../../components/SEO";
import BooksHeader from "../../components/admin/books/BooksHeader";
import BooksSearch from "../../components/admin/books/BooksSearch";
import BooksTable from "../../components/admin/books/BooksTable";
import BookForm from "../../components/admin/books/BookForm";
import ErrorMessage from "../../components/common/ErrorMessage";

const BOOKS_PER_PAGE = 10;

const AdminBooks = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [restoringId, setRestoringId] = useState(null);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const fetchBooks = useCallback(
    async (page = 1, searchValue = "") => {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminBooks({
          page,
          limit: BOOKS_PER_PAGE,
          search: searchValue,
        });

        setBooks(Array.isArray(data?.books) ? data.books : []);

        setPagination({
          page: data?.pagination?.page || 1,
          pages: data?.pagination?.pages || 1,
          total: data?.pagination?.total || 0,
        });
      } catch (err) {
        console.error("Admin Books Error:", err);

        if (err.response?.status === 401) {
          toast.error("Your session has expired. Please log in again.");
          navigate("/login", { replace: true });
          return;
        }

        setBooks([]);

        const message =
          err.response?.data?.message || err.message || "Unable to load books.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleSearch = (event) => {
    event.preventDefault();

    fetchBooks(1, search.trim());
  };

  const handleAddBook = () => {
    setError("");
    setEditingBook(null);
    setShowForm(true);
  };

  const handleEdit = (book) => {
    setError("");
    setEditingBook(book);
    setShowForm(true);
  };

  const handleCreateBook = async (bookData) => {
    try {
      setSaving(true);
      setError("");

      await createBook(bookData);

      toast.success("Book created successfully.");

      setShowForm(false);
      setEditingBook(null);

      await fetchBooks(1, search.trim());
    } catch (err) {
      console.error("Create Book Error:", err);

      const message =
        err.response?.data?.message || err.message || "Unable to create book.";

      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateBook = async (bookData) => {
    if (!editingBook?._id) {
      const message = "Unable to update this book.";

      setError(message);
      toast.error(message);

      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateBook(editingBook._id, bookData);

      toast.success("Book updated successfully.");

      setShowForm(false);
      setEditingBook(null);

      await fetchBooks(pagination.page, search.trim());
    } catch (err) {
      console.error("Update Book Error:", err);

      const message =
        err.response?.data?.message || err.message || "Unable to update book.";

      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!bookId || deletingId || restoringId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this book?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(bookId);
      setError("");

      await deleteBook(bookId);

      toast.success("Book deleted successfully.");

      const nextPage =
        books.length === 1 && pagination.page > 1
          ? pagination.page - 1
          : pagination.page;

      await fetchBooks(nextPage, search.trim());
    } catch (err) {
      console.error("Delete Book Error:", err);

      const message =
        err.response?.data?.message || err.message || "Unable to delete book.";

      setError(message);
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleRestore = async (bookId) => {
    if (!bookId || restoringId || deletingId) return;

    try {
      setRestoringId(bookId);
      setError("");

      await restoreBook(bookId);

      toast.success("Book restored successfully.");

      await fetchBooks(pagination.page, search.trim());
    } catch (err) {
      console.error("Restore Book Error:", err);

      const message =
        err.response?.data?.message || err.message || "Unable to restore book.";

      setError(message);
      toast.error(message);
    } finally {
      setRestoringId(null);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingBook(null);
    setError("");
  };

  const handlePreviousPage = () => {
    if (pagination.page <= 1 || loading) return;

    fetchBooks(pagination.page - 1, search.trim());
  };

  const handleNextPage = () => {
    if (pagination.page >= pagination.pages || loading) return;

    fetchBooks(pagination.page + 1, search.trim());
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <SEO
        title="Manage Books | BookStore Admin"
        description="Manage BookStore books, add new books, edit book details, search inventory, and restore deleted books."
        noindex
      />

      {showForm ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <BookForm
            key={editingBook?._id || "new-book"}
            initialData={editingBook || {}}
            onSubmit={editingBook ? handleUpdateBook : handleCreateBook}
            onCancel={handleCancelForm}
            loading={saving}
            isEdit={Boolean(editingBook)}
          />
        </motion.div>
      ) : (
        <>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <BooksHeader onAddBook={handleAddBook} />
          </motion.div>

          {/* Error */}
          {error && (
            <ErrorMessage
              title="Books Error"
              message={error}
              onClose={() => setError("")}
            />
          )}

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <BooksSearch
              search={search}
              onSearchChange={setSearch}
              onSubmit={handleSearch}
            />
          </motion.div>

          {/* Books Table */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <BooksTable
              books={books}
              loading={loading}
              total={pagination.total}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRestore={handleRestore}
              deletingId={deletingId}
              restoringId={restoringId}
            />

            {/* Pagination */}
            {!loading && books.length > 0 && pagination.pages > 1 && (
              <div className="flex flex-col gap-4 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-sm font-medium text-slate-500">
                  Page{" "}
                  <span className="font-semibold text-slate-950">
                    {pagination.page}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-950">
                    {pagination.pages}
                  </span>
                </p>

                <div className="flex w-full gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={handlePreviousPage}
                    disabled={pagination.page === 1 || loading}
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={pagination.page === pagination.pages || loading}
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default AdminBooks;
