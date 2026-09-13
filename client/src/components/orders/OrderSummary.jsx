import { motion } from "framer-motion";
import { FiDollarSign } from "react-icons/fi";

const OrderSummary = ({ subtotal = 0, shippingFee = 0, total = 0 }) => {
  const safeSubtotal = Math.max(0, Number(subtotal) || 0);
  const safeShipping = Math.max(0, Number(shippingFee) || 0);
  const safeTotal = Math.max(0, Number(total) || 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8"
      aria-labelledby="order-summary-heading"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
          <FiDollarSign
            size={20}
            className="text-slate-700"
            aria-hidden="true"
          />
        </div>

        <div>
          <h2
            id="order-summary-heading"
            className="text-xl font-bold text-slate-950 sm:text-2xl"
          >
            Order Summary
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Breakdown of your order total
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-slate-500">Subtotal</span>

          <span className="font-semibold text-slate-950">
            ${safeSubtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-slate-500">Shipping</span>

          {safeShipping === 0 ? (
            <span className="font-semibold text-green-600">Free</span>
          ) : (
            <span className="font-semibold text-slate-950">
              ${safeShipping.toFixed(2)}
            </span>
          )}
        </div>

        <div className="border-t border-slate-200 pt-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-base font-bold text-slate-950">Total</p>

              <p className="mt-1 text-xs text-slate-400">Final order amount</p>
            </div>

            <p className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              ${safeTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default OrderSummary;
