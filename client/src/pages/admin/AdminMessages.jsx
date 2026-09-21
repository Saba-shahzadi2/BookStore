import { useCallback, useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiMail,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";

import {
  deleteContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
} from "../../api/adminAPI";

// ============================================================
// Constants
// ============================================================

const PAGE_LIMIT = 10;

const STATUS_OPTIONS = [
  {
    value: "",
    label: "All Messages",
  },
  {
    value: "new",
    label: "New",
  },
  {
    value: "read",
    label: "Read",
  },
  {
    value: "replied",
    label: "Replied",
  },
];

// ============================================================
// Helpers
// ============================================================

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getStatusClasses = (status) => {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";

    case "read":
      return "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-300";

    case "replied":
      return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";

    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-300";
  }
};

const getErrorMessage = (error, fallback) => {
  return error?.response?.data?.message || error?.message || fallback;
};

// ============================================================
// Component
// ============================================================

const AdminMessages = () => {
  // ----------------------------------------------------------
  // Data state
  // ----------------------------------------------------------

  const [messages, setMessages] = useState([]);

  const [selectedMessage, setSelectedMessage] = useState(null);

  // ----------------------------------------------------------
  // Loading state
  // ----------------------------------------------------------

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // ----------------------------------------------------------
  // Error state
  // ----------------------------------------------------------

  const [error, setError] = useState("");

  // ----------------------------------------------------------
  // Search/filter state
  // ----------------------------------------------------------

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // ----------------------------------------------------------
  // Pagination state
  // ----------------------------------------------------------

  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    totalMessages: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // ==========================================================
  // Fetch Messages
  // ==========================================================

  const fetchMessages = useCallback(
    async ({
      showLoader = true,
      page = pagination.page,
      searchValue = search,
      statusValue = status,
    } = {}) => {
      try {
        if (showLoader) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        setError("");

        const response = await getAllContactMessages({
          page,
          limit: PAGE_LIMIT,
          search: searchValue || undefined,
          status: statusValue || undefined,
        });

        setMessages(response?.messages || []);

        setPagination(
          response?.pagination || {
            page,
            limit: PAGE_LIMIT,
            totalMessages: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        );
      } catch (err) {
        console.error("Fetch admin messages error:", err);

        const message = getErrorMessage(
          err,
          "Failed to load contact messages.",
        );

        setError(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [pagination.page, search, status],
  );

  // ==========================================================
  // Initial Load
  // ==========================================================

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // ==========================================================
  // Search
  // ==========================================================

  const handleSearch = (event) => {
    event.preventDefault();

    const value = searchInput.trim();

    setSearch(value);

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));

    fetchMessages({
      page: 1,
      searchValue: value,
      statusValue: status,
    });
  };

  // ==========================================================
  // Clear Search
  // ==========================================================

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));

    fetchMessages({
      page: 1,
      searchValue: "",
      statusValue: status,
    });
  };

  // ==========================================================
  // Status Filter
  // ==========================================================

  const handleStatusChange = (event) => {
    const value = event.target.value;

    setStatus(value);

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));

    fetchMessages({
      page: 1,
      searchValue: search,
      statusValue: value,
    });
  };

  // ==========================================================
  // Refresh
  // ==========================================================

  const handleRefresh = () => {
    fetchMessages({
      showLoader: false,
      page: pagination.page,
      searchValue: search,
      statusValue: status,
    });
  };

  // ==========================================================
  // View Message
  // ==========================================================

  const handleViewMessage = async (messageId) => {
    try {
      setDetailsLoading(true);

      const response = await getContactMessageById(messageId);

      setSelectedMessage(response?.message || null);

      // Automatically mark a new message as read.
      const currentMessage = response?.message;

      if (currentMessage?.status === "new") {
        await updateContactMessageStatus(messageId, "read");

        setSelectedMessage((previous) =>
          previous
            ? {
                ...previous,
                status: "read",
              }
            : previous,
        );

        setMessages((previous) =>
          previous.map((item) =>
            item._id === messageId
              ? {
                  ...item,
                  status: "read",
                }
              : item,
          ),
        );
      }
    } catch (err) {
      console.error("View contact message error:", err);

      toast.error(getErrorMessage(err, "Failed to load message."));
    } finally {
      setDetailsLoading(false);
    }
  };

  // ==========================================================
  // Close Details
  // ==========================================================

  const handleCloseDetails = () => {
    setSelectedMessage(null);
  };

  // ==========================================================
  // Update Status
  // ==========================================================

  const handleUpdateStatus = async (messageId, newStatus) => {
    try {
      setUpdatingId(messageId);

      const response = await updateContactMessageStatus(messageId, newStatus);

      const updatedMessage = response?.data;

      setMessages((previous) =>
        previous.map((item) =>
          item._id === messageId
            ? {
                ...item,
                ...(updatedMessage || {}),
                status: newStatus,
              }
            : item,
        ),
      );

      setSelectedMessage((previous) =>
        previous?._id === messageId
          ? {
              ...previous,
              ...(updatedMessage || {}),
              status: newStatus,
            }
          : previous,
      );

      toast.success("Message status updated successfully.");
    } catch (err) {
      console.error("Update message status error:", err);

      toast.error(getErrorMessage(err, "Failed to update message status."));
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================================
  // Delete Message
  // ==========================================================

  const handleDelete = async (messageId) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this message?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(messageId);

      await deleteContactMessage(messageId);

      setMessages((previous) =>
        previous.filter((item) => item._id !== messageId),
      );

      setSelectedMessage((previous) =>
        previous?._id === messageId ? null : previous,
      );

      setPagination((previous) => ({
        ...previous,
        totalMessages: Math.max(0, previous.totalMessages - 1),
      }));

      toast.success("Message deleted successfully.");

      // If the current page becomes empty,
      // move back to the previous page.
      if (messages.length === 1 && pagination.page > 1) {
        fetchMessages({
          page: pagination.page - 1,
          searchValue: search,
          statusValue: status,
        });
      }
    } catch (err) {
      console.error("Delete contact message error:", err);

      toast.error(getErrorMessage(err, "Failed to delete message."));
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================================
  // Pagination
  // ==========================================================

  const handlePreviousPage = () => {
    if (!pagination.hasPreviousPage) {
      return;
    }

    const nextPage = pagination.page - 1;

    setPagination((previous) => ({
      ...previous,
      page: nextPage,
    }));

    fetchMessages({
      page: nextPage,
      searchValue: search,
      statusValue: status,
    });
  };

  const handleNextPage = () => {
    if (!pagination.hasNextPage) {
      return;
    }

    const nextPage = pagination.page + 1;

    setPagination((previous) => ({
      ...previous,
      page: nextPage,
    }));

    fetchMessages({
      page: nextPage,
      searchValue: search,
      statusValue: status,
    });
  };

  // ==========================================================
  // Loading
  // ==========================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 dark:border-slate-700 dark:border-t-white" />

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading messages...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <>
      <div className="space-y-6">
        {/* ================================================== */}
        {/* Header */}
        {/* ================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900">
                <FiMail size={21} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Messages
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Manage customer contact messages.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <FiRefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* ================================================== */}
        {/* Search + Filter */}
        {/* ================================================== */}

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex flex-1">
              <div className="relative flex-1">
                <FiSearch
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search name, email or subject..."
                  maxLength={100}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
                />

                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 dark:hover:text-white"
                  >
                    <FiX size={17} />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="ml-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Search
              </button>
            </form>

            {/* Status */}
            <select
              value={status}
              onChange={handleStatusChange}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-slate-500 dark:focus:ring-slate-800"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ================================================== */}
        {/* Error */}
        {/* ================================================== */}

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
            <FiAlertCircle size={20} className="mt-0.5 shrink-0" />

            <div>
              <p className="font-semibold">Unable to load messages</p>

              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* Empty State */}
        {/* ================================================== */}

        {!error && messages.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <FiMail size={25} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
              No messages found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
              {search || status
                ? "Try changing your search or filter."
                : "Customer contact messages will appear here."}
            </p>
          </div>
        )}

        {/* ================================================== */}
        {/* Desktop Table */}
        {/* ================================================== */}

        {messages.length > 0 && (
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block dark:border-slate-700 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Subject
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Date
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {messages.map((message) => (
                    <tr
                      key={message._id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {message.name}
                          </p>

                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {message.email}
                          </p>
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="max-w-[280px] px-5 py-4">
                        <p className="truncate font-medium text-slate-800 dark:text-slate-200">
                          {message.subject}
                        </p>

                        <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                          {message.message}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <select
                          value={message.status}
                          onChange={(event) =>
                            handleUpdateStatus(message._id, event.target.value)
                          }
                          disabled={updatingId === message._id}
                          className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${getStatusClasses(
                            message.status,
                          )}`}
                        >
                          <option value="new">New</option>

                          <option value="read">Read</option>

                          <option value="replied">Replied</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(message.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewMessage(message._id)}
                            aria-label="View message"
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                          >
                            <FiEye size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(message._id)}
                            disabled={deletingId === message._id}
                            aria-label="Delete message"
                            className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                          >
                            {deletingId === message._id ? (
                              <span className="block h-[17px] w-[17px] animate-spin rounded-full border-2 border-red-300 border-t-red-600" />
                            ) : (
                              <FiTrash2 size={17} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* Mobile Cards */}
        {/* ================================================== */}

        {messages.length > 0 && (
          <div className="space-y-3 md:hidden">
            {messages.map((message) => (
              <div
                key={message._id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-slate-900 dark:text-white">
                      {message.name}
                    </h3>

                    <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                      {message.email}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                      message.status,
                    )}`}
                  >
                    {message.status}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {message.subject}
                  </p>

                  <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                    {message.message}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <span className="text-xs text-slate-400">
                    {formatDate(message.createdAt)}
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleViewMessage(message._id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                    >
                      <FiEye size={15} />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(message._id)}
                      disabled={deletingId === message._id}
                      className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-red-600 disabled:opacity-50 dark:border-red-900/50 dark:text-red-400"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================================================== */}
        {/* Pagination */}
        {/* ================================================== */}

        {pagination.totalMessages > 0 && (
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Page{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {Math.max(1, pagination.totalPages)}
              </span>{" "}
              ·{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {pagination.totalMessages}
              </span>{" "}
              messages
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={!pagination.hasPreviousPage}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <FiChevronLeft size={17} />
                Previous
              </button>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={!pagination.hasNextPage}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Next
                <FiChevronRight size={17} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* Message Details Modal */}
      {/* ==================================================== */}

      {(selectedMessage || detailsLoading) && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseDetails();
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <FiMail size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    Message Details
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Customer contact request
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseDetails}
                aria-label="Close"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Content */}
            {detailsLoading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 dark:border-slate-700 dark:border-t-white" />
              </div>
            ) : selectedMessage ? (
              <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-5">
                {/* Customer */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Name
                    </p>

                    <p className="mt-1 font-medium text-slate-900 dark:text-white">
                      {selectedMessage.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Email
                    </p>

                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="mt-1 block break-all font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>

                {/* Subject */}
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Subject
                  </p>

                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {selectedMessage.subject}
                  </p>
                </div>

                {/* Date */}
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Received
                  </p>

                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {formatDateTime(selectedMessage.createdAt)}
                  </p>
                </div>

                {/* Status */}
                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </p>

                  <select
                    value={selectedMessage.status}
                    onChange={(event) =>
                      handleUpdateStatus(
                        selectedMessage._id,
                        event.target.value,
                      )
                    }
                    disabled={updatingId === selectedMessage._id}
                    className={`rounded-lg border-0 px-3 py-2 text-sm font-semibold outline-none ${getStatusClasses(
                      selectedMessage.status,
                    )}`}
                  >
                    <option value="new">New</option>

                    <option value="read">Read</option>

                    <option value="replied">Replied</option>
                  </select>
                </div>

                {/* Message */}
                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Message
                  </p>

                  <div className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedMessage._id)}
                    disabled={deletingId === selectedMessage._id}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <FiTrash2 size={17} />
                    Delete
                  </button>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCloseDetails}
                      className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:flex-none dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Close
                    </button>

                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                        selectedMessage.subject,
                      )}`}
                      onClick={() =>
                        handleUpdateStatus(selectedMessage._id, "replied")
                      }
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:flex-none dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                      <FiMail size={17} />
                      Reply
                    </a>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminMessages;
