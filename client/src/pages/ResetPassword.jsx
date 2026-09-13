import { useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiSave,
} from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { resetPassword } from "../api/authAPI";
import SEO from "../components/SEO";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (formData) => {
    if (!token) {
      const message =
        "Reset link is invalid or missing. Please request a new password reset.";

      setError("root", {
        type: "validation",
        message,
      });

      toast.error(message);
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(token, formData.password);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to reset password.");
      }

      setSubmitted(true);

      toast.success(response.message || "Password reset successfully.");
    } catch (err) {
      console.error("Reset Password Error:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to reset password. Please try again.";

      setError("root", {
        type: "server",
        message,
      });

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (submitted) {
    return (
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-6 py-12">
        <SEO
          title="Password Updated | BookStore"
          description="Your BookStore password has been successfully updated."
          noindex
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
              <FiCheckCircle size={27} className="text-green-600" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-slate-950">
              Password updated
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Your password has been successfully updated. You can now log in
              using your new password.
            </p>

            <Link
              to="/login"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
            >
              <FiArrowLeft size={16} />
              Go to Login
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  // Reset Password Form
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-6 py-12">
      <SEO
        title="Reset Password | BookStore"
        description="Create a new secure password for your BookStore account."
        noindex
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <FiLock size={25} className="text-slate-700" />
          </div>

          {/* Heading */}
          <div className="mt-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Create a new password
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Choose a strong password that you haven't used before.
            </p>
          </div>

          {/* Error */}
          {errors.root && (
            <div
              role="alert"
              className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
            >
              <p className="text-sm font-medium text-red-700">
                {errors.root.message}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                New Password
              </label>

              <div className="relative">
                <FiLock
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  disabled={loading}
                  {...register("password", {
                    required: "Please fill in this field",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`w-full rounded-lg border bg-white py-3 pl-10 pr-11 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                    errors.password
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-200 focus:border-slate-400"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 disabled:cursor-not-allowed"
                >
                  {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                </button>
              </div>

              {errors.password ? (
                <p className="mt-2 text-xs text-red-500">
                  {errors.password.message}
                </p>
              ) : (
                <p className="mt-2 text-xs text-slate-400">
                  Use at least 6 characters.
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Confirm Password
              </label>

              <div className="relative">
                <FiLock
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                  disabled={loading}
                  {...register("confirmPassword", {
                    required: "Please fill in this field",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className={`w-full rounded-lg border bg-white py-3 pl-10 pr-11 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                    errors.confirmPassword
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-200 focus:border-slate-400"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  disabled={loading}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 disabled:cursor-not-allowed"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={17} />
                  ) : (
                    <FiEye size={17} />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !token}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <FiSave size={16} />
                  Updating Password...
                </>
              ) : (
                <>
                  <FiSave size={16} />
                  Reset Password
                </>
              )}
            </button>

            {/* Back */}
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              <FiArrowLeft size={15} />
              Back to Login
            </Link>
          </form>
        </div>
      </motion.div>
    </main>
  );
};

export default ResetPassword;
