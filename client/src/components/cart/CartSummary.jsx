import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiShoppingBag } from "react-icons/fi";

const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5;

const CartSummary = ({ subtotal = 0 }) => {
  const safeSubtotal = Math.max(0, Number(subtotal) || 0);

  const shipping =
    safeSubtotal === 0
      ? 0
      : safeSubtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : SHIPPING_COST;

  const total = Number((safeSubtotal + shipping).toFixed(2));

  const remainingForFreeShipping = Number(
    (FREE_SHIPPING_THRESHOLD - safeSubtotal).toFixed(2),
  );

  const shippingProgress = Math.min(
    (safeSubtotal / FREE_SHIPPING_THRESHOLD) * 100,
    100,
  );

  const hasFreeShipping = safeSubtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <motion.aside
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <FiShoppingBag size={18} aria-hidden="true" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-950 sm:text-xl">
              Order Summary
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Review your order before checkout.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {/* Free Shipping Progress */}
        {safeSubtotal > 0 && (
          <div className="mb-6 rounded-xl bg-slate-50 p-4">
            {hasFreeShipping ? (
              <div
                className="flex items-start gap-2.5"
                role="status"
                aria-live="polite"
              >
                <FiCheckCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-green-600"
                  aria-hidden="true"
                />

                <div>
                  <p className="text-sm font-semibold text-green-700">
                    You&apos;ve unlocked free shipping!
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your order qualifies for free delivery.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold leading-5 text-slate-700">
                  Add ${remainingForFreeShipping.toFixed(2)} more for free
                  shipping.
                </p>

                <div
                  className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"
                  role="progressbar"
                  aria-valuenow={Math.round(shippingProgress)}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-label="Progress toward free shipping"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${shippingProgress}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full bg-amber-500"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Price Breakdown */}
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">Subtotal</span>

            <span className="font-semibold text-slate-950">
              ${safeSubtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">Shipping</span>

            <span
              className={
                hasFreeShipping
                  ? "font-semibold text-green-600"
                  : "font-semibold text-slate-950"
              }
            >
              {hasFreeShipping ? "Free" : `$${shipping.toFixed(2)}`}
            </span>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-end justify-between gap-4">
              <span className="text-base font-bold text-slate-950">Total</span>

              <span className="text-2xl font-bold tracking-tight text-slate-950">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Checkout */}
        <Link
          to="/checkout"
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20 focus:ring-offset-2"
        >
          Proceed to Checkout
        </Link>

        {/* Continue Shopping */}
        <Link
          to="/books"
          className="mt-4 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
        >
          <FiArrowLeft size={16} aria-hidden="true" />
          Continue Shopping
        </Link>
      </div>
    </motion.aside>
  );
};

export default CartSummary;
