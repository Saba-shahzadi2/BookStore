import { motion } from "framer-motion";
import { FiCheckCircle, FiPackage, FiXCircle } from "react-icons/fi";

const OrderStatusCard = ({ order, cancelling, onCancel }) => {
  const status = order?.orderStatus || "pending";
  const paymentStatus = order?.paymentStatus || "pending";
  const paymentMethod = order?.paymentMethod || "COD";

  const canCancel = ["pending", "confirmed"].includes(status);

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

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      aria-labelledby="order-status-heading"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
          <FiPackage size={19} className="text-slate-700" aria-hidden="true" />
        </div>

        <div>
          <h2 id="order-status-heading" className="font-bold text-slate-950">
            Order Status
          </h2>

          <p className="text-sm text-slate-500">Current order progress</p>
        </div>
      </div>

      <div className="mt-6 divide-y divide-slate-100">
        <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
          <span className="text-sm text-slate-500">Status</span>

          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset sm:text-sm ${getStatusClasses(
              status,
            )}`}
            role="status"
          >
            {formatStatus(status)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 py-3">
          <span className="text-sm text-slate-500">Payment</span>

          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 sm:text-sm">
            {formatStatus(paymentStatus)}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4 py-3 last:pb-0">
          <span className="text-sm text-slate-500">Payment Method</span>

          <span className="max-w-[60%] text-right text-sm font-semibold text-slate-950">
            {formatStatus(paymentMethod)}
          </span>
        </div>
      </div>

      {canCancel && (
        <motion.button
          type="button"
          onClick={onCancel}
          disabled={cancelling}
          whileTap={!cancelling ? { scale: 0.98 } : undefined}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={cancelling ? "Cancelling order" : "Cancel order"}
        >
          {cancelling ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-red-300 border-t-red-600"
                aria-hidden="true"
              />
              Cancelling...
            </>
          ) : (
            <>
              <FiXCircle size={18} aria-hidden="true" />
              Cancel Order
            </>
          )}
        </motion.button>
      )}

      {!canCancel && status !== "cancelled" && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
          <FiCheckCircle size={17} aria-hidden="true" />
          <span>This order can no longer be cancelled.</span>
        </div>
      )}
    </motion.section>
  );
};

export default OrderStatusCard;
