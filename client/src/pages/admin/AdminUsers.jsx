import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiShield,
  FiUsers,
} from "react-icons/fi";

import { getAllUsers } from "../../api/adminAPI";
import SEO from "../../components/SEO";

import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";

const USERS_PER_PAGE = 20;

const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const fetchUsers = useCallback(
    async (page = 1, showToast = false) => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllUsers({
          page,
          limit: USERS_PER_PAGE,
        });

        setUsers(Array.isArray(data?.users) ? data.users : []);

        setPagination({
          page: data?.pagination?.page || 1,
          pages: data?.pagination?.pages || 1,
          total: data?.pagination?.total || 0,
        });

        if (showToast) {
          toast.success("Users refreshed successfully.");
        }
      } catch (err) {
        console.error("Admin Users Error:", err);

        if (err.response?.status === 401) {
          toast.error("Your session has expired. Please log in again.");
          navigate("/login", { replace: true });
          return;
        }

        setUsers([]);

        const message =
          err.response?.data?.message || err.message || "Unable to load users.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <SEO
        title="Manage Users | BookStore Admin"
        description="View registered BookStore customers and user account information from the admin panel."
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
            <FiUsers size={15} aria-hidden="true" />
            Management
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Users
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            View registered customers and their account information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchUsers(pagination.page, true)}
          disabled={loading}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <FiRefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
            aria-hidden="true"
          />
          Refresh Users
        </button>
      </motion.div>

      {/* Error */}
      {error && (
        <ErrorMessage
          title="Users Error"
          message={error}
          onClose={() => setError("")}
        />
      )}

      {/* Users Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        {loading ? (
          <Loader text="Loading users..." />
        ) : users.length === 0 ? (
          <EmptyState
            icon="inbox"
            title="No users found"
            message="Registered customers will appear here."
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
                  <FiUsers size={18} className="text-slate-700" />
                </div>

                <div className="min-w-0">
                  <h2 className="font-bold text-slate-950">Registered Users</h2>

                  <p className="mt-0.5 text-sm text-slate-500">
                    {pagination.total.toLocaleString()}{" "}
                    {pagination.total === 1 ? "user" : "users"} total
                  </p>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table
                className="w-full min-w-[800px]"
                aria-label="Registered users"
              >
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    <th scope="col" className="px-6 py-4">
                      User
                    </th>

                    <th scope="col" className="px-6 py-4">
                      Email
                    </th>

                    <th scope="col" className="px-6 py-4">
                      Role
                    </th>

                    <th scope="col" className="px-6 py-4">
                      Joined
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user, index) => {
                    const role = user.role === "admin" ? "admin" : "customer";

                    return (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.25,
                          delay: Math.min(index * 0.03, 0.25),
                        }}
                        className="transition-colors hover:bg-slate-50/70"
                      >
                        {/* User */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                role === "admin"
                                  ? "bg-purple-50"
                                  : "bg-slate-100"
                              }`}
                              aria-hidden="true"
                            >
                              {role === "admin" ? (
                                <FiShield
                                  size={17}
                                  className="text-purple-600"
                                />
                              ) : (
                                <FiUsers size={17} className="text-slate-500" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-950">
                                {user.name || "Unknown User"}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                ID: {user._id?.slice(-8) || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-5 text-sm text-slate-600">
                          <span className="break-all">{user.email || "—"}</span>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                              role === "admin"
                                ? "bg-purple-50 text-purple-700 ring-1 ring-purple-200"
                                : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                            }`}
                          >
                            {role === "admin" && (
                              <FiShield size={12} aria-hidden="true" />
                            )}

                            {role}
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="px-6 py-5 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-2">
                            <FiCalendar
                              size={14}
                              className="text-slate-400"
                              aria-hidden="true"
                            />

                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "—"}
                          </span>
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
                    onClick={() => fetchUsers(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                    className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                  >
                    <FiChevronLeft size={16} aria-hidden="true" />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() => fetchUsers(pagination.page + 1)}
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

export default AdminUsers;
