import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiPackage,
  FiRefreshCw,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";

import { getAllOrders, updateOrderStatus } from "../../api/adminAPI";
import SEO from "../../components/SEO";

import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";

const ORDERS_PER_PAGE = 20;

const STATUS_OPTIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_CLASSES = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  confirmed: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  processing: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  shipped: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  delivered: "bg-green-50 text-green-700 ring-1 ring-green-200",
  cancelled: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

const PAYMENT_CLASSES = {
  paid: "text-green-600",
  pending: "text-amber-600",
  failed: "text-red-600",
  refunded: "text-purple-600",
};

const AdminOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const fetchOrders = useCallback(
    async (page = 1, showToast = false) => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllOrders({
          page,
          limit: ORDERS_PER_PAGE,
        });

        setOrders(Array.isArray(data?.orders) ? data.orders : []);

        setPagination({
          page: data?.pagination?.page || 1,
          pages: data?.pagination?.pages || 1,
          total: data?.pagination?.total || 0,
        });

        if (showToast) {
          toast.success("Orders refreshed successfully.");
        }
      } catch (err) {
        console.error("Admin Orders Error:", err);

        if (err.response?.status === 401) {
          toast.error("Your session has expired. Please log in again.");
          navigate("/login", { replace: true });
          return;
        }

        setOrders([]);

        const message =
          err.response?.data?.message ||
          err.message ||
          "Unable to load orders.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, status) => {
    if (!orderId || !status || updatingId) return;

    try {
      setUpdatingId(orderId);
      setError("");

      const data = await updateOrderStatus(orderId, status);

      if (!data?.success || !data?.order) {
        throw new Error("Unable to update order status.");
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId ? data.order : order,
        ),
      );

      toast.success(
        `Order status updated to ${STATUS_LABELS[status] || status}.`,
      );
    } catch (err) {
      console.error("Update Order Status Error:", err);

      if (err.response?.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }

      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to update order status.";

      setError(message);
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const getAvailableStatuses = (currentStatus) => {
    const nextStatuses = STATUS_OPTIONS[currentStatus] || [];

    return [currentStatus, ...nextStatuses];
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <SEO
        title="Manage Orders | BookStore Admin"
        description="Manage customer orders, review payment information, and update order statuses from the BookStore admin panel."
        noindex
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-600">
            <FiShoppingBag size={15} aria-hidden="true" />
            Management
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Orders
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Manage customer orders, review payment information, and update order
            statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchOrders(pagination.page, true)}
          disabled={loading}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <FiRefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
            aria-hidden="true"
          />
          Refresh Orders
        </button>
      </motion.div>

      {/* Error */}
      {error && (
        <ErrorMessage
          title="Orders Error"
          message={error}
          onClose={() => setError("")}
        />
      )}

      {/* Orders Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        {loading ? (
          <Loader text="Loading orders..." />
        ) : orders.length === 0 ? (
          <EmptyState
            icon="shopping"
            title="No orders found"
            message="Customer orders will appear here when they place an order."
          />
        ) : (
          <>
            {/* Table Header */}
            <div className="border-b border-slate-200 px-4 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100"
                  aria-hidden="true"
                >
                  <FiPackage size={18} className="text-slate-700" />
                </div>

                <div className="min-w-0">
                  <h2 className="font-bold text-slate-950">Customer Orders</h2>

                  <p className="mt-0.5 text-sm text-slate-500">
                    {pagination.total.toLocaleString()}{" "}
                    {pagination.total === 1 ? "order" : "orders"} total
                  </p>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table
                className="w-full min-w-[1000px]"
                aria-label="Customer orders"
              >
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    <th scope="col" className="px-6 py-4">
                      Order
                    </th>

                    <th scope="col" className="px-6 py-4">
                      Customer
                    </th>

                    <th scope="col" className="px-6 py-4">
                      Items
                    </th>

                    <th scope="col" className="px-6 py-4">
                      Total
                    </th>

                    <th scope="col" className="px-6 py-4">
                      Payment
                    </th>

                    <th scope="col" className="px-6 py-4">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {orders.map((order, index) => {
                    const currentStatus = order.orderStatus || "pending";
                    const availableStatuses =
                      getAvailableStatuses(currentStatus);

                    const paymentStatus = String(
                      order.paymentStatus || "pending",
                    ).toLowerCase();

                    const paymentMethod = order.paymentMethod || "COD";

                    const itemCount = Array.isArray(order.items)
                      ? order.items.length
                      : 0;

                    return (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.25,
                          delay: Math.min(index * 0.03, 0.25),
                        }}
                        className="transition-colors hover:bg-slate-50/70"
                      >
                        {/* Order */}
                        <td className="px-6 py-5">
                          <div className="flex items-start gap-3">
                            <div
                              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100"
                              aria-hidden="true"
                            >
                              <FiPackage size={16} className="text-slate-600" />
                            </div>

                            <div>
                              <p className="font-semibold text-slate-950">
                                #{order._id?.slice(-8).toUpperCase() || "—"}
                              </p>

                              <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                                <FiCalendar size={12} aria-hidden="true" />

                                {order.createdAt
                                  ? new Date(
                                      order.createdAt,
                                    ).toLocaleDateString()
                                  : "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-5">
                          <div className="flex items-start gap-3">
                            <div
                              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100"
                              aria-hidden="true"
                            >
                              <FiUser size={16} className="text-slate-600" />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-950">
                                {order.user?.name || "Customer"}
                              </p>

                              <p className="mt-1 max-w-[220px] truncate text-xs text-slate-500">
                                {order.user?.email || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Items */}
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            {itemCount} {itemCount === 1 ? "item" : "items"}
                          </span>
                        </td>

                        {/* Total */}
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-slate-950">
                            ${Number(order.total || 0).toFixed(2)}
                          </p>
                        </td>

                        {/* Payment */}
                        <td className="px-6 py-5">
                          <p className="text-sm font-semibold uppercase text-slate-700">
                            {paymentMethod}
                          </p>

                          <p
                            className={`mt-1 text-xs font-medium capitalize ${
                              PAYMENT_CLASSES[paymentStatus] || "text-slate-400"
                            }`}
                          >
                            {paymentStatus}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <div className="flex flex-col items-start gap-2">
                            <select
                              value={currentStatus}
                              onChange={(event) =>
                                handleStatusChange(
                                  order._id,
                                  event.target.value,
                                )
                              }
                              disabled={
                                updatingId === order._id ||
                                availableStatuses.length <= 1
                              }
                              aria-label={`Update order ${
                                order._id || ""
                              } status`}
                              className={`rounded-full border-0 px-3 py-2 text-xs font-semibold capitalize outline-none focus:ring-2 focus:ring-slate-950/20 disabled:cursor-not-allowed disabled:opacity-60 ${
                                STATUS_CLASSES[currentStatus] ||
                                "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {availableStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {STATUS_LABELS[status] || status}
                                </option>
                              ))}
                            </select>

                            {updatingId === order._id && (
                              <span className="text-xs font-medium text-slate-400">
                                Updating status...
                              </span>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-sm font-medium text-slate-500">
                  Page{" "}
                  <span className="font-semibold text-slate-950">
                    {pagination.page}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-950">
                    {pagination.pages}
                  </span>
                </p>

                <div className="flex w-full gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={() => fetchOrders(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                    className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                  >
                    <FiChevronLeft size={16} aria-hidden="true" />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() => fetchOrders(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages || loading}
                    className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                  >
                    Next
                    <FiChevronRight size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AdminOrders;
