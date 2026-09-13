import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { registerUser } from "../api/authAPI";
import { useAuth } from "../context/useAuth";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import SEO from "../components/SEO";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData) => {
    setLoading(true);

    try {
      const data = await registerUser(formData);

      if (!data?.success || !data?.user || !data?.token) {
        throw new Error(
          data?.message || "Invalid registration response from server.",
        );
      }

      login(data.user, data.token);

      toast.success(data.message || "Account created successfully!");

      navigate("/", { replace: true });
    } catch (err) {
      console.error("Registration error:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";

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
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 px-4 py-10 sm:px-6 sm:py-12">
      <SEO
        title="Create Account | BookStore"
        description="Create your BookStore account to explore books, shop online, and manage your orders."
        noindex
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm sm:p-8"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Join BookStore and start exploring.
          </p>
        </div>

        {/* Server Error */}
        {errors.root && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
          >
            {errors.root.message}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              disabled={loading}
              {...register("name", {
                required: "Please fill in this field",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              className={`w-full rounded-lg border px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-slate-950/10 ${
                errors.name
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-slate-950"
              }`}
            />

            {errors.name && (
              <p className="mt-2 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>

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
              className={`w-full rounded-lg border px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-slate-950/10 ${
                errors.email
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-slate-950"
              }`}
            />

            {errors.email && (
              <p className="mt-2 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Minimum 6 characters"
                disabled={loading}
                {...register("password", {
                  required: "Please fill in this field",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full rounded-lg border px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-slate-950/10 ${
                  errors.password
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-300 focus:border-slate-950"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-950 disabled:cursor-not-allowed"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            {errors.password ? (
              <p className="mt-2 text-xs text-red-500">
                {errors.password.message}
              </p>
            ) : (
              <p className="mt-2 text-xs text-slate-400">
                Password must be at least 6 characters.
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-slate-950 hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </main>
  );
};

export default Register;
