import { motion } from "framer-motion";
import { FiBookOpen, FiHeart, FiInbox, FiShoppingBag } from "react-icons/fi";

const EmptyState = ({
  title = "Nothing here yet",
  message = "There is nothing to display right now.",
  icon = "inbox",
  action = null,
}) => {
  const icons = {
    inbox: FiInbox,
    shopping: FiShoppingBag,
    wishlist: FiHeart,
    books: FiBookOpen,
  };

  const Icon = icons[icon] || FiInbox;

  return (
    <div className="flex min-h-[300px] items-center justify-center px-4 py-12 sm:min-h-[340px] sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 shadow-sm sm:h-[72px] sm:w-[72px]"
          aria-hidden="true"
        >
          <Icon className="text-slate-500" size={28} strokeWidth={1.8} />
        </motion.div>

        {/* Content */}
        <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
          {title}
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 sm:text-base">
          {message}
        </p>

        {/* Action */}
        {action && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="mt-6"
          >
            {action}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default EmptyState;
