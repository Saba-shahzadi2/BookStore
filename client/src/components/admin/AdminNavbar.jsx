import { motion } from "framer-motion";
import { FiMenu, FiShield, FiUser } from "react-icons/fi";

import { useAuth } from "../../context/useAuth";

const AdminNavbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  const adminName = user?.name?.trim() || "Admin";
  const adminRole = user?.role?.trim() || "admin";

  return (
    <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Mobile Menu Button */}
      <motion.button
        type="button"
        onClick={onMenuClick}
        whileTap={{ scale: 0.95 }}
        className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10 lg:hidden"
        aria-label="Open admin menu"
      >
        <FiMenu size={22} aria-hidden="true" />
      </motion.button>

      {/* Page Heading */}
      <div className="hidden min-w-0 lg:block">
        <h2 className="truncate text-lg font-bold tracking-tight text-slate-950">
          Admin Dashboard
        </h2>

        <p className="mt-0.5 text-xs font-medium text-slate-500">
          Manage your BookStore
        </p>
      </div>

      {/* Admin Information */}
      <div className="ml-auto flex items-center gap-3">
        {/* Avatar */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100"
          aria-hidden="true"
        >
          <FiUser size={18} className="text-slate-600" />
        </div>

        {/* User Details */}
        <div className="hidden min-w-0 sm:block">
          <p className="max-w-[180px] truncate text-sm font-bold text-slate-950">
            {adminName}
          </p>

          <div className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <FiShield size={12} aria-hidden="true" />

            <span className="capitalize">{adminRole}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
