import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";

const OrderSuccess = ({ orderId }) => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="p-6 text-center sm:p-8 md:p-10">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.15,
              duration: 0.4,
              type: "spring",
              stiffness: 180,
              damping: 14,
            }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/50"
            aria-hidden="true"
          >
            <FiCheckCircle size={32} className="text-emerald-600" />
          </motion.div>

          <div role="status" aria-live="polite">
            <h1 className="mt-7 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Order Placed Successfully!
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
              Thank you for your purchase. Your order has been received
              successfully and is now being processed.
            </p>
          </div>

          {orderId && (
            <div className="mx-auto mt-6 max-w-md rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Order ID
              </p>

              <p className="mt-1 break-all text-sm font-semibold leading-6 text-slate-900">
                {orderId}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {orderId && (
              <Link
                to={`/orders/${orderId}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20"
              >
                View Order
                <FiArrowRight size={16} aria-hidden="true" />
              </Link>
            )}

            <Link
              to="/books"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
            >
              <FiShoppingBag size={17} aria-hidden="true" />
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-center">
          <p className="text-xs leading-5 text-slate-500">
            You can view your order details and track its status from your
            Orders page.
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default OrderSuccess;
