import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiMail,
  FiMapPin,
  FiMessageSquare,
  FiPhone,
  FiSend,
} from "react-icons/fi";
import toast from "react-hot-toast";

import { submitContactMessage } from "../api/contactAPI";
import SEO from "../components/SEO";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (submitted) {
      setSubmitted(false);
    }
  };

  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (!name) {
      return "Please enter your name.";
    }

    if (name.length < 2) {
      return "Name must be at least 2 characters.";
    }

    if (!email) {
      return "Please enter your email address.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address.";
    }

    if (!subject) {
      return "Please enter a subject.";
    }

    if (subject.length < 3) {
      return "Subject must be at least 3 characters.";
    }

    if (!message) {
      return "Please enter your message.";
    }

    if (message.length < 10) {
      return "Message must be at least 10 characters.";
    }

    if (message.length > 2000) {
      return "Message cannot exceed 2000 characters.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitted(false);
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      };

      const response = await submitContactMessage(payload);

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to send your message. Please try again.",
        );
      }

      setSubmitted(true);

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      toast.success(
        response?.message || "Your message has been sent successfully.",
      );
    } catch (err) {
      console.error("Contact form submission error:", err);

      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again later.";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <SEO
        title="Contact Us | BookStore"
        description="Contact BookStore for questions about books, orders, services, or support. Send us a message and our team will get back to you."
      />

      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600 sm:text-sm">
              Get in touch
            </p>

            <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              We&apos;d love to hear from you.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              Have a question about a book, your order, or our services? Send us
              a message and our team will get back to you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Information */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <FiMail size={19} aria-hidden="true" />
              </div>

              <h2 className="mt-5 font-bold text-slate-950">Email Us</h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Send us an email and we&apos;ll respond as soon as possible.
              </p>

              <a
                href="mailto:support@bookstore.com"
                className="mt-4 inline-block text-sm font-semibold text-slate-950 transition hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                support@bookstore.com
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <FiPhone size={19} aria-hidden="true" />
              </div>

              <h2 className="mt-5 font-bold text-slate-950">Call Us</h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Our support team is available during business hours.
              </p>

              <a
                href="tel:+923001234567"
                className="mt-4 inline-block text-sm font-semibold text-slate-950 transition hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                +92 300 1234567
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <FiMapPin size={19} aria-hidden="true" />
              </div>

              <h2 className="mt-5 font-bold text-slate-950">Visit Us</h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                BookStore
                <br />
                Gujranwala, Pakistan
              </p>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <FiMessageSquare size={19} aria-hidden="true" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
                    Send us a message
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Fill out the form below and we&apos;ll get back to you.
                  </p>
                </div>
              </div>

              {/* Success Message */}
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4"
                  role="status"
                  aria-live="polite"
                >
                  <FiCheckCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-green-600"
                    aria-hidden="true"
                  />

                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      Message sent successfully
                    </p>

                    <p className="mt-1 text-xs leading-5 text-green-700">
                      Thank you for contacting us. We&apos;ll get back to you
                      soon.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
                  role="alert"
                  aria-live="assertive"
                >
                  <FiAlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-red-600"
                    aria-hidden="true"
                  />

                  <div>
                    <p className="text-sm font-semibold text-red-800">
                      Unable to send message
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-700">
                      {error}
                    </p>
                  </div>
                </motion.div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
                noValidate
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Your Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      autoComplete="name"
                      maxLength={100}
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-950/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      maxLength={150}
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-950/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    autoComplete="off"
                    maxLength={200}
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-950/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>

                {/* Message */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-slate-700"
                    >
                      Message
                    </label>

                    <span className="text-xs text-slate-400">
                      {formData.message.length}/2000
                    </span>
                  </div>

                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    rows={6}
                    maxLength={2000}
                    disabled={loading}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-950/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { y: -1 } : undefined}
                  whileTap={!loading ? { scale: 0.98 } : undefined}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span
                        className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                        aria-hidden="true"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend size={16} aria-hidden="true" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
