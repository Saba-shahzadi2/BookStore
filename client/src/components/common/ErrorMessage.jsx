import { motion } from "framer-motion";
import { FiAlertCircle, FiX } from "react-icons/fi";

const ErrorMessage = ({
  message = "Something went wrong. Please try again.",
  title = "Error",
  onClose,
  className = "",
}) => {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      role="alert"
      aria-live="assertive"
      className={`flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 ${className}`}
    >
      {/* Error Icon */}
      <div
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100"
        aria-hidden="true"
      >
        <FiAlertCircle size={19} className="text-red-600" strokeWidth={2} />
      </div>

      {/* Error Content */}
      <div className="min-w-0 flex-1">
        {title && <h3 className="text-sm font-bold text-red-800">{title}</h3>}

        <p className="mt-1 text-sm leading-6 text-red-700">{message}</p>
      </div>

      {/* Close Button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg p-1.5 text-red-400 transition hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/30"
          aria-label="Close error message"
        >
          <FiX size={18} aria-hidden="true" />
        </button>
      )}
    </motion.div>
  );
};

export default ErrorMessage;
