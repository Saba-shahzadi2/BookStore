import { motion } from "framer-motion";
import {
  FiBriefcase,
  FiCreditCard,
  FiDollarSign,
  FiSmartphone,
} from "react-icons/fi";

const PaymentMethod = ({ value, onChange }) => {
  const paymentMethods = [
    {
      id: "COD",
      title: "Cash on Delivery",
      description: "Pay when your books are delivered.",
      icon: FiDollarSign,
      badge: "Recommended",
    },
    {
      id: "EASYPAISA",
      title: "Easypaisa",
      description: "Pay using Easypaisa and provide your payment reference.",
      icon: FiSmartphone,
    },
    {
      id: "JAZZCASH",
      title: "JazzCash",
      description: "Pay using JazzCash and provide your payment reference.",
      icon: FiSmartphone,
    },
    {
      id: "BANK_TRANSFER",
      title: "Bank Transfer",
      description: "Transfer the amount and provide your payment reference.",
      icon: FiBriefcase,
    },
    {
      id: "CARD",
      title: "Debit / Credit Card",
      description:
        "Card payment integration can be connected to a payment gateway.",
      icon: FiCreditCard,
    },
  ];

  return (
    <section
      className="mt-10 border-t border-slate-200 pt-8"
      aria-labelledby="payment-method-heading"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
          <FiCreditCard
            className="text-slate-700"
            size={20}
            aria-hidden="true"
          />
        </div>

        <div>
          <h2
            id="payment-method-heading"
            className="text-xl font-bold text-slate-950"
          >
            Payment Method
          </h2>

          <p className="text-sm text-slate-500">
            Choose your preferred payment method.
          </p>
        </div>
      </div>

      <div
        className="mt-5 space-y-3"
        role="radiogroup"
        aria-labelledby="payment-method-heading"
      >
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const selected = value === method.id;

          return (
            <motion.label
              key={method.id}
              whileTap={{ scale: 0.995 }}
              className={`block cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                selected
                  ? "border-slate-950 bg-slate-50 shadow-sm ring-1 ring-slate-950"
                  : "border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selected}
                  onChange={(e) => onChange(e.target.value)}
                  aria-label={method.title}
                  className="mt-1 h-4 w-4 shrink-0 accent-slate-950 focus:ring-2 focus:ring-slate-950/20"
                />

                <motion.div
                  animate={{
                    scale: selected ? 1.04 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    selected
                      ? "bg-slate-950 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <Icon size={19} aria-hidden="true" />
                </motion.div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900">
                      {method.title}
                    </h3>

                    {method.badge && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        {method.badge}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    {method.description}
                  </p>
                </div>

                <div
                  className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                    selected
                      ? "border-slate-950 bg-slate-950"
                      : "border-slate-300 bg-white"
                  }`}
                  aria-hidden="true"
                >
                  {selected && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </motion.label>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3.5 text-sm leading-5 text-blue-700">
        <p className="font-medium text-blue-800">Demo payment processing</p>

        <p className="mt-1">
          Online payment verification is not processed automatically in this
          demo. Orders using Easypaisa, JazzCash, Bank Transfer, or Card remain
          pending until payment is manually verified.
        </p>
      </div>
    </section>
  );
};

export default PaymentMethod;
