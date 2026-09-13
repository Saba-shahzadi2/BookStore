import { motion } from "framer-motion";

const BookCover = ({ book }) => {
  const imageUrl =
    book?.coverImage || "https://via.placeholder.com/500x650?text=Book";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45 }}
      className="group flex w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6 md:p-8"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="flex w-full items-center justify-center"
      >
        <img
          src={imageUrl}
          alt={book?.title ? `${book.title} book cover` : "Book cover"}
          loading="lazy"
          className="h-auto max-h-[520px] w-full max-w-sm rounded-xl object-contain shadow-lg transition-shadow duration-300 group-hover:shadow-xl sm:max-h-[580px] md:max-h-[620px]"
        />
      </motion.div>
    </motion.div>
  );
};

export default BookCover;
