import { useEffect, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiLock,
  FiRefreshCw,
} from "react-icons/fi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import { resendOTP, verifyOTP } from "../api/authAPI";
import SEO from "../components/SEO";

const VerifyOTP = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [timer, setTimer] = useState(60);

  const inputRefs = useRef([]);

  // Countdown
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // OTP Change
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;

    setOtp(updatedOtp);
    setError("");

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Keyboard Navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Paste OTP
  const handlePaste = (e) => {
    e.preventDefault();

    const pastedValue = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) return;

    const updatedOtp = ["", "", "", "", "", ""];

    pastedValue.split("").forEach((digit, index) => {
      updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);
    setError("");

    const nextIndex = Math.min(pastedValue.length, 5);

    inputRefs.current[nextIndex]?.focus();
  };

  // Verify OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (!email) {
      const message = "Email address is missing. Please request a new OTP.";

      setError(message);
      toast.error(message);
      return;
    }

    if (otpValue.length !== 6) {
      const message = "Please enter the complete 6-digit OTP.";

      setError(message);
      toast.error(message);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await verifyOTP(email, otpValue);

      if (!response?.success || !response?.resetToken) {
        const message = response?.message || "Invalid or expired OTP.";

        setError(message);
        toast.error(message);
        return;
      }

      setResetToken(response.resetToken);
      setSubmitted(true);

      toast.success(response.message || "OTP verified successfully.");
    } catch (err) {
      console.error("Verify OTP Error:", err);

      const message =
        err?.response?.data?.message ||
        "Invalid or expired OTP. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (timer > 0 || resending || !email) return;

    try {
      setResending(true);
      setError("");

      const response = await resendOTP(email);

      if (!response?.success) {
        const message = response?.message || "Unable to resend OTP.";

        setError(message);
        toast.error(message);
        return;
      }

      setTimer(60);
      setOtp(["", "", "", "", "", ""]);

      toast.success(
        response.message || "A new OTP has been sent to your email.",
      );

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 0);
    } catch (err) {
      console.error("Resend OTP Error:", err);

      const message =
        err?.response?.data?.message ||
        "Unable to resend OTP. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  // Success Screen
  if (submitted) {
    return (
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-6 py-12">
        <SEO
          title="OTP Verified | BookStore"
          description="Your BookStore email has been successfully verified."
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
              OTP verified
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Your email has been verified successfully. You can continue to
              reset your password.
            </p>

            <button
              type="button"
              onClick={() => {
                if (!resetToken) {
                  const message =
                    "Reset session expired. Please verify OTP again.";

                  setError(message);
                  toast.error(message);
                  setSubmitted(false);
                  return;
                }

                navigate(
                  `/reset-password?token=${encodeURIComponent(resetToken)}`,
                  { replace: true },
                );
              }}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
            >
              Continue
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  const displayError =
    error ||
    (!email ? "Email address is missing. Please request a new OTP." : "");

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-6 py-12">
      <SEO
        title="Verify OTP | BookStore"
        description="Verify your BookStore email with the OTP sent to your email address."
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
              Verify your email
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter the 6-digit verification code sent to
            </p>

            {email && (
              <p className="mt-1 break-all text-sm font-semibold text-slate-950">
                {email}
              </p>
            )}
          </div>

          {/* Error */}
          {displayError && (
            <div
              role="alert"
              className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
            >
              <p className="text-sm font-medium text-red-700">{displayError}</p>
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="mt-8">
            <div
              className="flex justify-center gap-2 sm:gap-3"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  autoFocus={index === 0}
                  disabled={loading}
                  aria-label={`OTP digit ${index + 1}`}
                  className={`h-12 w-10 rounded-lg border bg-white text-center text-lg font-bold text-slate-950 outline-none transition focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50 sm:h-14 sm:w-12 ${
                    error
                      ? "border-red-300 focus:border-red-500"
                      : "border-slate-200 focus:border-slate-400"
                  }`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            {timer > 0 ? (
              <p className="text-sm text-slate-500">
                Resend code in{" "}
                <span className="font-semibold text-slate-950">{timer}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || !email}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiRefreshCw
                  size={15}
                  className={resending ? "animate-spin" : ""}
                />

                {resending ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>

          {/* Back */}
          <Link
            to="/forgot-password"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            <FiArrowLeft size={15} />
            Change email
          </Link>
        </div>
      </motion.div>
    </main>
  );
};

export default VerifyOTP;
