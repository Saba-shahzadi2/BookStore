import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiBook,
  FiClock,
  FiDollarSign,
  FiMail,
  FiRefreshCw,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import toast from "react-hot-toast";

import { getAdminStats } from "../../api/adminAPI";
import SEO from "../../components/SEO";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";

const INITIAL_STATS = {
  totalUsers: 0,
  totalBooks: 0,
  totalOrders: 0,
  totalRevenue: 0,
  pendingOrders: 0,
  newMessages: 0,
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState(false);

  const fetchStats = useCallback(async (isRetry = false) => {
    try {
      if (isRetry) {
        setRetrying(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getAdminStats();

      setStats((prev) => ({
        ...prev,
        ...(data?.stats || {}),
      }));

      if (isRetry) {
        toast.success("Dashboard statistics updated.");
      }
    } catch (err) {
      console.error("Admin Stats Error:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to load dashboard statistics.";

      setError(message);

      if (isRetry) {
        toast.error(message);
      }
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    {
      title: "Total Books",
      value: Number(stats.totalBooks || 0).toLocaleString(),
      icon: FiBook,
      description: "Active books in store",
    },
    {
      title: "Total Orders",
      value: Number(stats.totalOrders || 0).toLocaleString(),
      icon: FiShoppingBag,
      description: "Orders placed",
    },
    {
      title: "Total Users",
      value: Number(stats.totalUsers || 0).toLocaleString(),
      icon: FiUsers,
      description: "Registered customers",
    },
    {
      title: "Total Revenue",
      value: `$${Number(stats.totalRevenue || 0).toFixed(2)}`,
      icon: FiDollarSign,
      description: "Revenue from paid orders",
    },
  ];

  const newMessages = Number(stats.newMessages || 0);

  if (loading) {
    return <Loader text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <SEO
        title="Admin Dashboard | BookStore"
        description="Manage and monitor BookStore users, books, orders, revenue, messages, and store activity from the admin dashboard."
        noindex
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-600">
            Overview
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Monitor your bookstore performance, customers, orders, revenue, and
            messages.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchStats(true)}
          disabled={retrying}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw
            size={16}
            className={retrying ? "animate-spin" : ""}
            aria-hidden="true"
          />

          {retrying ? "Refreshing..." : "Refresh"}
        </button>
      </motion.div>

      {/* Error */}
      {error && (
        <ErrorMessage
          title="Dashboard Error"
          message={error}
          onClose={() => setError("")}
        />
      )}

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.article
              key={stat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.06,
              }}
              whileHover={{ y: -2 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                  <Icon
                    size={21}
                    className="text-slate-700"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <p className="mt-5 text-sm font-medium text-slate-500">
                {stat.title}
              </p>

              <h2 className="mt-1 break-words text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                {stat.value}
              </h2>

              <p className="mt-2 text-xs text-slate-400">{stat.description}</p>
            </motion.article>
          );
        })}
      </div>

      {/* Messages */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.24 }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <FiMail size={21} className="text-slate-700" aria-hidden="true" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-950">
                New Messages
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Customer contact messages waiting for review.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Awaiting review
              </span>

              <span
                className={`inline-flex min-w-12 items-center justify-center rounded-full px-3 py-1.5 text-sm font-bold ${
                  newMessages > 0
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {newMessages.toLocaleString()}
              </span>
            </div>

            <Link
              to="/admin/messages"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
            >
              View Messages
              <FiArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Pending Orders */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.3 }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50">
              <FiClock
                size={21}
                className="text-amber-600"
                aria-hidden="true"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-950">
                Pending Orders
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Orders waiting for admin processing.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Awaiting action
            </span>

            <span
              className={`inline-flex min-w-12 items-center justify-center rounded-full px-3 py-1.5 text-sm font-bold ${
                Number(stats.pendingOrders || 0) > 0
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {Number(stats.pendingOrders || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AdminDashboard;
