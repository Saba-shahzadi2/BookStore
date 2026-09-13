import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCalendar,
  FiPackage,
  FiShoppingBag,
} from "react-icons/fi";
import toast from "react-hot-toast";

import { getMyOrders } from "../api/orderAPI";

import SEO from "../components/SEO";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyOrders();
      const userOrders = data?.orders;

      setOrders(Array.isArray(userOrders) ? userOrders : []);
    } catch (err) {
      console.error("My Orders Error:", err);

      if (err.response?.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }

      setOrders([]);

      const errorMessage =
        err.response?.data?.message ||
        "Unable to load your orders. Please try again.";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // This effect intentionally loads the user's orders
    // when the Orders page becomes ready.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, [fetchOrders]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatStatus = (status = "pending") => {
    return String(status)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10";

      case "cancelled":
        return "bg-red-50 text-red-700 ring-1 ring-red-600/10";

      case "shipped":
        return "bg-blue-50 text-blue-700 ring-1 ring-blue-600/10";

      case "processing":
        return "bg-purple-50 text-purple-700 ring-1 ring-purple-600/10";

      case "confirmed":
        return "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-600/10";

      default:
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-600/10";
    }
  };

  const getPaymentStatusClasses = (status) => {
    switch (status) {
      case "paid":
        return "text-emerald-600";

      case "failed":
      case "refunded":
        return "text-red-600";

      default:
        return "text-amber-600";
    }
  };

  if (loading) {
    return <Loader text="Loading your orders..." fullScreen />;
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
        <SEO
          title="My Orders | BookStore"
          description="View and track your BookStore orders, purchase history, payment status, and order details."
          noindex
        />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <ErrorMessage title="Unable to Load Orders" message={error} />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={fetchOrders}
              className="inline-flex items-center justify-center rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20"
            >
              Try Again
            </button>

            <Link
              to="/books"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
            >
              <FiShoppingBag size={17} aria-hidden="true" />
              Browse Books
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <SEO
        title="My Orders | BookStore"
        description="View and track your BookStore orders, purchase history, payment status, and order details."
        noindex
      />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8 sm:mb-10"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-600 sm:text-sm">
            Your purchase history
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            My Orders
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            View and track all your book orders.
          </p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <EmptyState
              icon="shopping"
              title="No orders yet"
              message="Your purchases will appear here after you place an order."
              action={
                <Link
                  to="/books"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20"
                >
                  Browse Books
                  <FiArrowRight size={17} aria-hidden="true" />
                </Link>
              }
            />
          </motion.div>
        ) : (
          <div className="space-y-5">
            {orders.map((order, index) => {
              const items = Array.isArray(order?.items) ? order.items : [];

              const itemCount = items.reduce(
                (total, item) => total + Number(item?.quantity || 0),
                0,
              );

              const status = order?.orderStatus || "pending";
              const paymentStatus = order?.paymentStatus || "pending";
              const total = Math.max(0, Number(order?.total) || 0);

              return (
                <motion.article
                  key={order._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(index * 0.05, 0.25),
                  }}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Order Header */}
                  <div className="border-b border-slate-200 p-5 sm:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                            <FiPackage
                              size={17}
                              className="text-slate-700"
                              aria-hidden="true"
                            />
                          </div>

                          <h2 className="text-sm font-bold text-slate-950 sm:text-base">
                            Order #{order._id?.slice(-8).toUpperCase() || "N/A"}
                          </h2>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                              status,
                            )}`}
                          >
                            {formatStatus(status)}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
                          <FiCalendar size={15} aria-hidden="true" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Order Total
                        </p>

                        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                          ${total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Items
                      </h3>

                      <span className="text-xs font-medium text-slate-500 sm:text-sm">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {items.slice(0, 4).map((item, itemIndex) => (
                        <div
                          key={item._id || itemIndex}
                          className="flex min-w-0 gap-3 rounded-xl border border-slate-200 p-3"
                        >
                          <img
                            src={
                              item?.coverImage ||
                              "https://via.placeholder.com/80x100?text=Book"
                            }
                            alt={item?.title || "Book cover"}
                            loading="lazy"
                            className="h-20 w-16 shrink-0 rounded-lg border border-slate-200 object-cover"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-semibold leading-5 text-slate-950">
                              {item?.title || "Book"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Qty: {Number(item?.quantity) || 0}
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                              $
                              {(
                                Math.max(0, Number(item?.price) || 0) *
                                Math.max(0, Number(item?.quantity) || 0)
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {items.length > 4 && (
                      <p className="mt-3 text-center text-xs text-slate-500">
                        +{items.length - 4} more{" "}
                        {items.length - 4 === 1 ? "item" : "items"} in this
                        order
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-slate-200 bg-slate-50/60 p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
                        <span className="text-slate-500">Payment:</span>

                        <span className="font-medium text-slate-950">
                          {formatStatus(order?.paymentMethod || "COD")}
                        </span>

                        <span className="text-slate-300" aria-hidden="true">
                          •
                        </span>

                        <span className="text-slate-500">Status:</span>

                        <span
                          className={`font-semibold ${getPaymentStatusClasses(
                            paymentStatus,
                          )}`}
                        >
                          {formatStatus(paymentStatus)}
                        </span>
                      </div>

                      <Link
                        to={`/orders/${order._id}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20 sm:w-auto"
                      >
                        View Order
                        <FiArrowRight size={17} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default Orders;
