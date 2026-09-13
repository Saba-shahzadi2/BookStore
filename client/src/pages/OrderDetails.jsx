import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiMapPin } from "react-icons/fi";
import toast from "react-hot-toast";

import { cancelOrder, getOrderById } from "../api/orderAPI";
import SEO from "../components/SEO";

import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";

import OrderHeader from "../components/orders/OrderHeader";
import OrderStatusCard from "../components/orders/OrderStatusCard";
import OrderItems from "../components/orders/OrderItems";
import OrderSummary from "../components/orders/OrderSummary";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError("Invalid order ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setSuccessMessage("");
        setActionError("");

        const data = await getOrderById(id);

        if (!data?.success || !data?.order) {
          throw new Error("Order not found.");
        }

        setOrder(data.order);
      } catch (err) {
        console.error("Order Details Error:", err);

        if (err.response?.status === 401) {
          toast.error("Your session has expired. Please log in again.");
          navigate("/login", { replace: true });
          return;
        }

        setOrder(null);

        const message =
          err.response?.data?.message ||
          err.message ||
          "Unable to load order details.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const handleCancelOrder = async () => {
    if (cancelling) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmed) return;

    try {
      setCancelling(true);
      setSuccessMessage("");
      setActionError("");

      const data = await cancelOrder(id);

      if (!data?.success || !data?.order) {
        throw new Error("Unable to cancel this order.");
      }

      setOrder(data.order);

      const message = data.message || "Order cancelled successfully.";

      setSuccessMessage(message);
      toast.success(message);
    } catch (err) {
      console.error("Cancel Order Error:", err);

      if (err.response?.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }

      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to cancel this order.";

      setActionError(message);
      toast.error(message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <Loader text="Loading order..." fullScreen />;
  }

  if (error || !order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
        <SEO
          title="Order Details | BookStore"
          description="View your BookStore order details, delivery status, items, payment information, and shipping address."
          noindex
        />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <ErrorMessage
            title="Unable to Load Order"
            message={error || "Order not found."}
          />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
            >
              <FiArrowLeft size={17} aria-hidden="true" />
              My Orders
            </Link>

            <Link
              to="/books"
              className="inline-flex items-center justify-center rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <SEO
        title="Order Details | BookStore"
        description="View your BookStore order details, delivery status, items, payment information, and shipping address."
        noindex
      />

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
          >
            <FiArrowLeft size={17} aria-hidden="true" />
            Back to My Orders
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-7"
        >
          <OrderHeader order={order} />
        </motion.div>

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-medium text-emerald-700"
            role="status"
            aria-live="polite"
          >
            {successMessage}
          </motion.div>
        )}

        {actionError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <ErrorMessage
              title="Unable to Cancel Order"
              message={actionError}
            />
          </motion.div>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            <OrderStatusCard
              order={order}
              cancelling={cancelling}
              onCancel={handleCancelOrder}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <FiMapPin
                  size={19}
                  className="text-slate-700"
                  aria-hidden="true"
                />
              </div>

              <div>
                <h2 className="font-bold text-slate-950">Delivery Address</h2>

                <p className="text-sm text-slate-500">
                  Your shipping information
                </p>
              </div>
            </div>

            <address className="mt-5 space-y-1 text-sm not-italic leading-6 text-slate-600">
              <p className="font-semibold text-slate-950">
                {order.shippingAddress?.fullName || "N/A"}
              </p>

              <p>{order.shippingAddress?.phone || "N/A"}</p>

              <p>{order.shippingAddress?.address || "N/A"}</p>

              <p>
                {order.shippingAddress?.city || "N/A"}
                {order.shippingAddress?.postalCode
                  ? `, ${order.shippingAddress.postalCode}`
                  : ""}
              </p>
            </address>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <OrderItems items={order.items} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <OrderSummary
            subtotal={order.subtotal}
            shippingFee={order.shippingFee}
            total={order.total}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <Link
            to="/books"
            className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20"
          >
            Continue Shopping
          </Link>

          <Link
            to="/orders"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
          >
            View My Orders
          </Link>
        </motion.div>
      </section>
    </main>
  );
};

export default OrderDetails;
