import { FiCheckCircle, FiMail, FiShield, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";

import { useAuth } from "../context/useAuth";
import SEO from "../components/SEO";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const isAdmin = user.role === "admin";
  const isActive = user.isActive !== false;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10">
      <SEO
        title="My Profile | BookStore"
        description="View your BookStore account information, profile details, account role, and account status."
        noindex
      />

      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            View your personal information and account details.
          </p>
        </motion.div>

        {/* Profile Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="h-28 bg-slate-900 sm:h-36" />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                {/* Avatar */}
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-slate-100 shadow-md sm:h-28 sm:w-28">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.name || "User"}'s avatar`}
                      loading="lazy"
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    <FiUser
                      size={38}
                      className="text-slate-400"
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* User Info */}
                <div className="min-w-0 pb-1">
                  <h2 className="truncate text-xl font-bold text-slate-950 sm:text-2xl">
                    {user.name || "User"}
                  </h2>

                  <p className="mt-1 break-all text-sm text-slate-500">
                    {user.email || "No email available"}
                  </p>
                </div>
              </div>

              {/* Status */}
              <span
                className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  isActive
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <FiCheckCircle size={13} aria-hidden="true" />

                {isActive ? "Active Account" : "Inactive Account"}
              </span>
            </div>
          </div>
        </motion.section>

        {/* Personal Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="border-b border-slate-100 pb-5">
            <h2 className="text-base font-semibold text-slate-950 sm:text-lg">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your account information.
            </p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {/* Full Name */}
            <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-slate-200 hover:bg-slate-50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <FiUser
                  size={17}
                  className="text-slate-600"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Full Name
                </p>

                <p className="mt-1 break-words text-sm font-medium text-slate-950">
                  {user.name || "N/A"}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-slate-200 hover:bg-slate-50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <FiMail
                  size={17}
                  className="text-slate-600"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email Address
                </p>

                <p className="mt-1 break-all text-sm font-medium text-slate-950">
                  {user.email || "N/A"}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-slate-200 hover:bg-slate-50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <FiShield
                  size={17}
                  className="text-slate-600"
                  aria-hidden="true"
                />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Account Role
                </p>

                <p className="mt-1 text-sm font-medium capitalize text-slate-950">
                  {user.role || "user"}
                </p>
              </div>
            </div>

            {/* Account Type */}
            <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-slate-200 hover:bg-slate-50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <FiCheckCircle
                  size={17}
                  className="text-slate-600"
                  aria-hidden="true"
                />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Account Type
                </p>

                <p className="mt-1 text-sm font-medium text-slate-950">
                  {isAdmin ? "Administrator" : "Customer"}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Account Status */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >
          <div>
            <h2 className="text-base font-semibold text-slate-950 sm:text-lg">
              Account Status
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current status of your BookStore account.
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <p className="text-sm font-medium text-slate-950">
                {isActive
                  ? "Your account is active"
                  : "Your account is inactive"}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {isActive
                  ? "You can access your BookStore account normally."
                  : "Some account features may be unavailable."}
              </p>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                isActive
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              <FiCheckCircle size={13} aria-hidden="true" />

              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </motion.section>
      </div>
    </main>
  );
};

export default Profile;
