import { motion } from "framer-motion";
import { FiPackage } from "react-icons/fi";

const OrderItems = ({ items = [] }) => {
  const orderItems = Array.isArray(items) ? items : [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8"
      aria-labelledby="ordered-books-heading"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2
            id="ordered-books-heading"
            className="text-xl font-bold text-slate-950 sm:text-2xl"
          >
            Ordered Books
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Items included in this order
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
          <FiPackage size={21} className="text-slate-700" aria-hidden="true" />
        </div>
      </div>

      {orderItems.length === 0 ? (
        <div
          className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-6 text-center text-sm text-slate-500"
          role="status"
        >
          No items found for this order.
        </div>
      ) : (
        <div className="mt-6 divide-y divide-slate-200">
          {orderItems.map((item, index) => {
            const price = Math.max(0, Number(item?.price) || 0);
            const quantity = Math.max(0, Number(item?.quantity) || 0);
            const itemTotal = Number((price * quantity).toFixed(2));

            return (
              <motion.article
                key={item?._id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.05, 0.25),
                }}
                className="flex gap-4 py-5 first:pt-0 last:pb-0"
              >
                <div className="h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <img
                    src={
                      item?.coverImage ||
                      "https://via.placeholder.com/80x100?text=Book"
                    }
                    alt={item?.title || "Book cover"}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 font-semibold leading-5 text-slate-950">
                      {item?.title || "Book"}
                    </h3>

                    {item?.author && (
                      <p className="mt-1 text-sm text-slate-500">
                        by {item.author}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                      <span>
                        Quantity:{" "}
                        <strong className="font-semibold text-slate-700">
                          {quantity}
                        </strong>
                      </span>

                      <span>
                        Unit price:{" "}
                        <strong className="font-semibold text-slate-700">
                          ${price.toFixed(2)}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 sm:text-right">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Item total
                    </p>

                    <p className="mt-0.5 text-base font-bold text-slate-950">
                      ${itemTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </motion.section>
  );
};

export default OrderItems;
