import { motion } from "framer-motion";
import { FiPackage, FiTruck } from "react-icons/fi";

const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5;

const CheckoutSummary = ({ items = [], subtotal = 0 }) => {
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

  return (
    <aside
      className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      aria-label="Order summary"
    >
      <div className="border-b border-slate-200 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
            <FiPackage
              className="text-slate-700"
              size={19}
              aria-hidden="true"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-950">Order Summary</h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {items.length} {items.length === 1 ? "item" : "items"} in your
              order
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="space-y-5">
          {items.length > 0 ? (
            items.map((item, index) => {
              const book = item?.book;

              if (!book) return null;

              const quantity = Math.max(0, Number(item?.quantity) || 0);
              const price = Math.max(0, Number(book?.price) || 0);
              const itemTotal = price * quantity;

              return (
                <motion.div
                  key={book._id || `${book.title}-${index}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: index * 0.04,
                  }}
                  className="flex gap-4"
                >
                  <img
                    src={
                      book.coverImage ||
                      "https://via.placeholder.com/80x100?text=Book"
                    }
                    alt={book.title || "Book cover"}
                    loading="lazy"
                    className="h-20 w-16 shrink-0 rounded-lg border border-slate-200 object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-slate-950">
                      {book.title || "Untitled Book"}
                    </h3>

                    <div className="mt-1.5 flex items-center justify-between gap-3">
                      <p className="text-xs text-slate-500">Qty: {quantity}</p>

                      <p className="text-sm font-semibold text-slate-950">
                        ${itemTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">
              No items in your order.
            </div>
          )}
        </div>

        <div className="mt-6 space-y-4 border-t border-slate-200 pt-6 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">Subtotal</span>

            <span className="font-medium text-slate-950">
              ${safeSubtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-slate-500">
              <FiTruck size={15} aria-hidden="true" />
              Shipping
            </span>

            <span
              className={`font-medium ${
                shipping === 0 && safeSubtotal >= FREE_SHIPPING_THRESHOLD
                  ? "text-emerald-600"
                  : "text-slate-950"
              }`}
            >
              {shipping === 0 && safeSubtotal >= FREE_SHIPPING_THRESHOLD
                ? "Free"
                : `$${shipping.toFixed(2)}`}
            </span>
          </div>

          {safeSubtotal > 0 && safeSubtotal < FREE_SHIPPING_THRESHOLD && (
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3.5">
              <p className="text-xs leading-5 text-amber-700">
                Add{" "}
                <span className="font-semibold">
                  ${remainingForFreeShipping.toFixed(2)}
                </span>{" "}
                more to get free shipping.
              </p>
            </div>
          )}

          {safeSubtotal >= FREE_SHIPPING_THRESHOLD && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3.5">
              <p className="text-xs font-medium leading-5 text-emerald-700">
                🎉 You qualify for free shipping!
              </p>
            </div>
          )}

          <div className="flex items-end justify-between gap-4 border-t border-slate-200 pt-5">
            <span className="text-base font-semibold text-slate-950">
              Total
            </span>

            <span className="text-2xl font-bold tracking-tight text-slate-950">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CheckoutSummary;
