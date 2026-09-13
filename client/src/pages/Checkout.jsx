import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiShoppingBag } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getCart } from "../api/cartAPI";
import { createOrder } from "../api/orderAPI";
import { useCart } from "../context/useCart";

import CheckoutSummary from "../components/checkout/CheckoutSummary";
import OrderSuccess from "../components/checkout/OrderSuccess";
import PaymentMethod from "../components/checkout/PaymentMethod";
import ShippingAddressForm from "../components/checkout/ShippingAddressForm";

import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";
import SEO from "../components/SEO";

const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5;

const Checkout = () => {
  const navigate = useNavigate();
  const { fetchCart } = useCart();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [paymentReference, setPaymentReference] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    const fetchCheckoutCart = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCart();
        const checkoutCart = data?.cart;

        if (!checkoutCart) {
          throw new Error("Unable to load your cart.");
        }

        setCart(checkoutCart);
      } catch (err) {
        console.error(
          "Checkout Cart Error:",
          err.response?.data || err.message,
        );

        if (err.response?.status === 401) {
          toast.error("Your session has expired. Please log in again.");
          navigate("/login", { replace: true });
          return;
        }

        setCart(null);

        const message =
          err.response?.data?.message ||
          err.message ||
          "Unable to load checkout.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutCart();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setPaymentReference("");

    if (error) {
      setError("");
    }
  };

  const items = Array.isArray(cart?.items) ? cart.items : [];

  const subtotal = Number(
    items
      .reduce((total, item) => {
        const price = Math.max(0, Number(item?.book?.price) || 0);
        const quantity = Math.max(0, Number(item?.quantity) || 0);

        return total + price * quantity;
      }, 0)
      .toFixed(2),
  );

  const shipping =
    subtotal === 0
      ? 0
      : subtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : SHIPPING_COST;

  const total = Number((subtotal + shipping).toFixed(2));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (placingOrder) {
      return;
    }

    const shippingAddress = {
      fullName: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      postalCode: form.postalCode.trim(),
    };

    const hasMissingAddress = Object.values(shippingAddress).some(
      (value) => !value,
    );

    if (hasMissingAddress) {
      const message = "Please complete all shipping address fields.";

      setError(message);
      toast.error(message);
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      const orderData = {
        shippingAddress,
        paymentMethod,
        paymentReference: paymentReference.trim(),
      };

      const data = await createOrder(orderData);

      if (!data?.success || !data?.order?._id) {
        throw new Error("Order could not be created.");
      }

      await fetchCart();

      setOrderId(data.order._id);

      toast.success(data.message || "Order placed successfully!");
    } catch (err) {
      console.error("Create Order Error:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }

      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to place your order. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (orderId) {
    return <OrderSuccess orderId={orderId} />;
  }

  if (loading) {
    return <Loader text="Loading checkout..." fullScreen />;
  }

  if (error && !cart) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 sm:px-6">
        <SEO
          title="Checkout | BookStore"
          description="Complete your BookStore purchase by entering your shipping and payment details."
          noindex
        />

        <div className="w-full max-w-xl">
          <ErrorMessage title="Unable to load checkout" message={error} />

          <div className="mt-6 text-center">
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20"
            >
              <FiArrowLeft size={16} aria-hidden="true" />
              Back to Cart
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 sm:px-6">
        <SEO
          title="Checkout | BookStore"
          description="Complete your BookStore purchase by entering your shipping and payment details."
          noindex
        />

        <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <EmptyState
            icon="shopping"
            title="Your cart is empty"
            message="Add some books before proceeding to checkout."
            action={
              <Link
                to="/books"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20"
              >
                <FiShoppingBag size={17} aria-hidden="true" />
                Browse Books
              </Link>
            }
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <SEO
        title="Checkout | BookStore"
        description="Complete your BookStore purchase by entering your shipping and payment details."
        noindex
      />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {/* Back to Cart */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
          >
            <FiArrowLeft size={16} aria-hidden="true" />
            Back to Cart
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 mt-7 sm:mb-10 sm:mt-8"
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-600">
            Complete your purchase
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Enter your delivery and payment details to complete your order.
          </p>
        </motion.div>

        {/* Checkout Layout */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
          {/* Checkout Form */}
          <motion.form
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            onSubmit={handleSubmit}
            className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8"
          >
            <ShippingAddressForm form={form} onChange={handleChange} />

            <PaymentMethod
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            />

            {/* Payment Reference */}
            {paymentMethod !== "COD" && (
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <label
                  htmlFor="paymentReference"
                  className="block text-sm font-semibold text-slate-900"
                >
                  Payment Reference
                  <span className="ml-1 font-normal text-slate-500">
                    (optional)
                  </span>
                </label>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  If you have a transaction or reference number, you can enter
                  it here.
                </p>

                <input
                  id="paymentReference"
                  name="paymentReference"
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  maxLength={100}
                  placeholder="Enter transaction/reference number"
                  className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-6" role="alert">
                <ErrorMessage message={error} />
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={placingOrder}
              className="mt-8 flex w-full items-center justify-center rounded-xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
            >
              {placingOrder
                ? "Placing Order..."
                : `Place Order — $${total.toFixed(2)}`}
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-slate-400">
              Final order totals and stock availability are verified securely by
              the server.
            </p>
          </motion.form>

          {/* Order Summary */}
          <motion.aside
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <CheckoutSummary items={items} subtotal={subtotal} />
          </motion.aside>
        </div>
      </section>
    </main>
  );
};

export default Checkout;
