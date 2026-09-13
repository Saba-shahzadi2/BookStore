import { motion } from "framer-motion";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const OrderHeader = ({ order }) => {
  const status = order?.orderStatus || "pending";

  const formatStatus = (value) => {
    return value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getStatusClasses = (value) => {
    switch (value) {
      case "delivered":
        return "bg-green-50 text-green-700 ring-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 ring-red-200";
      case "shipped":
        return "bg-blue-50 text-blue-700 ring-blue-200";
      case "processing":
        return "bg-purple-50 text-purple-700 ring-purple-200";
      case "confirmed":
        return "bg-cyan-50 text-cyan-700 ring-cyan-200";
      default:
        return "bg-amber-50 text-amber-700 ring-amber-200";
    }
  };

  const isCancelled = status === "cancelled";

  const Icon = isCancelled ? FiXCircle : FiCheckCircle;

  return (
    <motion.header
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-slate-200 bg-white px-5 py-8 text-center shadow-sm sm:px-8 sm:py-10"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.45,
          delay: 0.1,
          type: "spring",
          stiffness: 180,
        }}
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
          isCancelled ? "bg-red-50" : "bg-green-50"
        }`}
      >
        <Icon
          size={38}
          className={isCancelled ? "text-red-500" : "text-green-500"}
          aria-hidden="true"
        />
      </motion.div>

      <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
        {isCancelled ? "Order Cancelled" : "Order Details"}
      </h1>

      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
        {isCancelled
          ? "This order has been cancelled successfully."
          : "Here are the details of your order."}
      </p>

      <div className="mx-auto mt-7 max-w-2xl rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Order ID
        </p>

        <p className="mt-2 break-all font-mono text-sm font-semibold text-slate-800 sm:text-base">
          {order?._id || "N/A"}
        </p>
      </div>

      <div className="mt-5 flex justify-center">
        <span
          className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-inset ${getStatusClasses(
            status,
          )}`}
          role="status"
          aria-label={`Order status: ${formatStatus(status)}`}
        >
          {formatStatus(status)}
        </span>
      </div>
    </motion.header>
  );
};

export default OrderHeader;
