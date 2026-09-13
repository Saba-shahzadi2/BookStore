import { FiMail, FiShield, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/useAuth";
import SEO from "../../components/SEO";

const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <SEO
        title="Admin Profile | BookStore"
        description="View your BookStore administrator profile, account information, email address, and account role."
        noindex
      />

      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">
          Account
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Admin Profile
        </h1>

        <p className="mt-2 text-slate-500">
          View your administrator account information.
        </p>
      </div>

      <div className="max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-8 sm:px-8">
          <div className="flex items-center gap-5">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 text-white"
              aria-hidden="true"
            >
              <FiUser size={28} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-slate-950">
                {user?.name || "Admin"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Administrator Account
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <div className="flex items-center gap-4 px-6 py-5 sm:px-8">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100"
              aria-hidden="true"
            >
              <FiUser size={18} className="text-slate-600" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Full Name
              </p>

              <p className="mt-1 break-words text-sm font-semibold text-slate-950">
                {user?.name || "Not available"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 py-5 sm:px-8">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100"
              aria-hidden="true"
            >
              <FiMail size={18} className="text-slate-600" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Email Address
              </p>

              <p className="mt-1 break-all text-sm font-semibold text-slate-950">
                {user?.email || "Not available"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 py-5 sm:px-8">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100"
              aria-hidden="true"
            >
              <FiShield size={18} className="text-slate-600" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Account Role
              </p>

              <span className="mt-1 inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold capitalize text-purple-700">
                {user?.role || "admin"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
