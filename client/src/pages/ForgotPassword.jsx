import { useState } from "react";
import { FiArrowLeft, FiMail, FiSend, FiLoader } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { forgotPassword } from "../api/authAPI";
import SEO from "../components/SEO";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (formData) => {
    const normalizedEmail = formData.email.trim().toLowerCase();

    setLoading(true);

    try {
      const response = await forgotPassword(normalizedEmail);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to send OTP.");
      }

      toast.success(response.message || "OTP sent successfully!");

      navigate(`/verify-otp?email=${encodeURIComponent(normalizedEmail)}`, {
        replace: true,
      });
    } catch (err) {
      console.error("Forgot Password Error:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to send OTP. Please try again.";

      setError("root", {
        type: "server",
        message,
      });

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-6 py-12">
      <SEO
        title="Forgot Password | BookStore"
        description="Reset your BookStore password securely using email verification and OTP."
        noindex
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <FiMail size={25} className="text-slate-700" />
          </div>

          {/* Heading */}
          <div className="mt-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Forgot your password?
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter your email address and we'll send you a 6-digit OTP to reset
              your password.
            </p>
          </div>

          {/* Server Error */}
          {errors.root && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4"
            >
              <p className="text-sm font-medium text-red-700">
                {errors.root.message}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email Address
            </label>

            <div className="relative">
              <FiMail
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                disabled={loading}
                {...register("email", {
                  required: "Please fill in this field",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className={`w-full rounded-lg border bg-white py-3 pl-10 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                  errors.email
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-slate-400"
                }`}
              />
            </div>

            {errors.email && (
              <p className="mt-2 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? (
                <>
                  <FiLoader size={16} className="animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  <FiSend size={16} />
                  Send OTP
                </>
              )}
            </button>

            {/* Back */}
            <Link
              to="/login"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              <FiArrowLeft size={15} />
              Back to Login
            </Link>
          </form>
        </div>

        {/* Footer text */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Having trouble? Contact our support team.
        </p>
      </motion.div>
    </main>
  );
};

export default ForgotPassword;
