import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiCheck,
  FiImage,
  FiLoader,
  FiTag,
  FiUser,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";

const EMPTY_FORM = {
  title: "",
  author: "",
  description: "",
  price: "",
  category: "",
  coverImage: "",
  stock: 0,
  isFeatured: false,
};

const BookForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState({
    ...EMPTY_FORM,
    title: initialData.title || "",
    author: initialData.author || "",
    description: initialData.description || "",
    price: initialData.price ?? "",
    category: initialData.category || "",
    coverImage: initialData.coverImage || "",
    stock: initialData.stock ?? 0,
    isFeatured: initialData.isFeatured ?? false,
  });

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setFormData({
      ...EMPTY_FORM,
      title: initialData.title || "",
      author: initialData.author || "",
      description: initialData.description || "",
      price: initialData.price ?? "",
      category: initialData.category || "",
      coverImage: initialData.coverImage || "",
      stock: initialData.stock ?? 0,
      isFeatured: initialData.isFeatured ?? false,
    });

    setImageError(false);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "coverImage") {
      setImageError(false);
    }

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const title = formData.title.trim();
    const author = formData.author.trim();
    const description = formData.description.trim();
    const category = formData.category.trim();
    const coverImage = formData.coverImage.trim();

    const price = Number(formData.price);
    const stock = Number(formData.stock);

    if (!title || !author || !description || !category) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (title.length < 2) {
      toast.error("Book title must be at least 2 characters.");
      return;
    }

    if (author.length < 2) {
      toast.error("Author name must be at least 2 characters.");
      return;
    }

    if (category.length < 2) {
      toast.error("Category must be at least 2 characters.");
      return;
    }

    if (description.length < 10) {
      toast.error("Description must be at least 10 characters.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      toast.error("Please enter a valid stock quantity.");
      return;
    }

    onSubmit({
      title,
      author,
      description,
      price,
      category,
      coverImage,
      stock,
      isFeatured: Boolean(formData.isFeatured),
    });
  };

  const hasPreview = Boolean(formData.coverImage.trim()) && !imageError;

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Intro */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
            <FiBookOpen size={19} aria-hidden="true" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {isEdit ? "Edit Book Details" : "Add a New Book"}
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {isEdit
                ? "Update the book information below and save your changes."
                : "Enter the book details below to add it to your store."}
            </p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <FiTag className="text-slate-500" size={17} aria-hidden="true" />

          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Basic Information
          </h3>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Book Title <span className="text-red-500">*</span>
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={150}
            disabled={loading}
            placeholder="Enter book title"
            autoComplete="off"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          />

          <p className="mt-1.5 text-xs text-slate-400">2–150 characters</p>
        </div>

        {/* Author & Category */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="author"
              className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
            >
              <FiUser size={15} aria-hidden="true" />
              Author <span className="text-red-500">*</span>
            </label>

            <input
              id="author"
              name="author"
              type="text"
              value={formData.author}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={100}
              disabled={loading}
              placeholder="Enter author name"
              autoComplete="off"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
            >
              <FiTag size={15} aria-hidden="true" />
              Category <span className="text-red-500">*</span>
            </label>

            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={50}
              disabled={loading}
              placeholder="e.g. Fiction, Technology, Business"
              autoComplete="off"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label
              htmlFor="description"
              className="text-sm font-semibold text-slate-700"
            >
              Description <span className="text-red-500">*</span>
            </label>

            <span className="text-xs text-slate-400">
              {formData.description.length}/2000
            </span>
          </div>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            minLength={10}
            maxLength={2000}
            rows={6}
            disabled={loading}
            placeholder="Write a clear description of the book..."
            className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          />

          <p className="mt-1.5 text-xs text-slate-400">Minimum 10 characters</p>
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <FiBookOpen className="text-slate-500" size={17} aria-hidden="true" />

          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Pricing & Inventory
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Price <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                $
              </span>

              <input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                disabled={loading}
                placeholder="0.00"
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label
              htmlFor="stock"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Stock Quantity <span className="text-red-500">*</span>
            </label>

            <input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              step="1"
              disabled={loading}
              placeholder="0"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <FiImage className="text-slate-500" size={17} aria-hidden="true" />

          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Book Cover
          </h3>
        </div>

        <div>
          <label
            htmlFor="coverImage"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Cover Image URL
          </label>

          <input
            id="coverImage"
            name="coverImage"
            type="url"
            value={formData.coverImage}
            onChange={handleChange}
            disabled={loading}
            placeholder="https://example.com/book-cover.jpg"
            autoComplete="url"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          />

          <p className="mt-1.5 text-xs text-slate-400">
            Add a direct image URL for the book cover.
          </p>
        </div>

        {hasPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Cover Preview
            </p>

            <div className="flex min-h-48 items-center justify-center rounded-lg bg-white p-4">
              <img
                src={formData.coverImage.trim()}
                alt="Book cover preview"
                onError={() => setImageError(true)}
                className="max-h-56 w-auto max-w-full rounded-lg object-contain shadow-md"
              />
            </div>
          </motion.div>
        )}

        {formData.coverImage.trim() && imageError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            Unable to load the image from this URL. Please check the URL.
          </div>
        )}
      </div>

      {/* Featured */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <label
          htmlFor="isFeatured"
          className="flex cursor-pointer items-start gap-3"
        >
          <input
            id="isFeatured"
            name="isFeatured"
            type="checkbox"
            checked={formData.isFeatured}
            onChange={handleChange}
            disabled={loading}
            className="mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-300 accent-slate-900 disabled:cursor-not-allowed"
          />

          <span>
            <span className="block text-sm font-semibold text-slate-800">
              Mark this book as featured
            </span>

            <span className="mt-1 block text-xs leading-5 text-slate-500">
              Featured books can appear in the store's featured section.
            </span>
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <motion.button
          type="button"
          onClick={onCancel}
          disabled={loading}
          whileTap={{ scale: 0.98 }}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiX size={17} aria-hidden="true" />
          Cancel
        </motion.button>

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <FiLoader size={17} className="animate-spin" aria-hidden="true" />
              {isEdit ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <FiCheck size={17} aria-hidden="true" />
              {isEdit ? "Update Book" : "Create Book"}
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default BookForm;
