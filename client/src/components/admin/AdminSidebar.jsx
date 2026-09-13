import { useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiBook,
  FiGrid,
  FiLogOut,
  FiShoppingBag,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";

import { useAuth } from "../../context/useAuth";

const AdminSidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: FiGrid,
    },
    {
      label: "Books",
      path: "/admin/books",
      icon: FiBook,
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: FiShoppingBag,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: FiUsers,
    },
    {
      label: "Profile",
      path: "/admin/profile",
      icon: FiUser,
    },
  ];

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      await logout();

      toast.success("Logged out successfully.");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Admin Logout Error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to log out. Please try again.",
      );

      setLoggingOut(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight text-slate-950">
            BookStore
          </h1>

          <p className="mt-0.5 text-xs font-medium text-slate-500">
            Admin Panel
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10 lg:hidden"
            aria-label="Close admin sidebar"
          >
            <FiX size={20} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-5"
        aria-label="Admin navigation"
      >
        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Management
        </p>

        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-950/10 ${
                    isActive
                      ? "bg-slate-950 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "bg-slate-50 text-slate-500 group-hover:bg-white group-hover:text-slate-950"
                      }`}
                    >
                      <Icon size={18} aria-hidden="true" />
                    </span>

                    <span className="flex-1">{item.label}</span>

                    {isActive && (
                      <motion.span
                        layoutId="admin-active-indicator"
                        className="h-1.5 w-1.5 rounded-full bg-amber-400"
                        aria-hidden="true"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="shrink-0 border-t border-slate-200 p-4">
        <motion.button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          whileTap={!loggingOut ? { scale: 0.98 } : undefined}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loggingOut ? (
            <span
              className="h-[19px] w-[19px] animate-spin rounded-full border-2 border-red-200 border-t-red-600"
              aria-hidden="true"
            />
          ) : (
            <FiLogOut size={19} aria-hidden="true" />
          )}

          <span>{loggingOut ? "Logging out..." : "Logout"}</span>
        </motion.button>
      </div>
    </div>
  );
};

export default AdminSidebar;
