import { useState } from "react";
import { motion } from "framer-motion";
import { FiMapPin } from "react-icons/fi";

const ShippingAddressForm = ({ form, onChange }) => {
  const [touched, setTouched] = useState({});

  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const getError = (name, value) => {
    const trimmedValue = value?.trim() || "";

    if (!trimmedValue) {
      return "This field is required";
    }

    if (name === "name" && trimmedValue.length < 2) {
      return "Name must be at least 2 characters";
    }

    if (name === "phone") {
      const phoneRegex = /^[+]?[\d\s()-]{7,20}$/;

      if (!phoneRegex.test(trimmedValue)) {
        return "Please enter a valid phone number";
      }
    }

    if (name === "postalCode") {
      const postalCodeRegex = /^[A-Za-z0-9\s-]{3,20}$/;

      if (!postalCodeRegex.test(trimmedValue)) {
        return "Please enter a valid postal code";
      }
    }

    if (name === "city" && trimmedValue.length < 2) {
      return "City must be at least 2 characters";
    }

    if (name === "address" && trimmedValue.length < 5) {
      return "Address must be at least 5 characters";
    }

    return "";
  };

  const getInputClassName = (name) => {
    const error = touched[name] && getError(name, form[name]);

    return `w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 ${
      error
        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
        : "border-slate-300 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
    }`;
  };

  const renderError = (name) => {
    const error = touched[name] && getError(name, form[name]);

    if (!error) {
      return null;
    }

    return (
      <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
        {error}
      </p>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
          <FiMapPin className="text-slate-700" aria-hidden="true" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-950">
            Delivery Information
          </h2>

          <p className="text-sm text-slate-500">
            Where should we deliver your books?
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
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
            name="name"
            value={form.name}
            onChange={onChange}
            onBlur={handleBlur}
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            placeholder="Your full name"
            aria-invalid={Boolean(touched.name && getError("name", form.name))}
            aria-describedby={
              touched.name && getError("name", form.name)
                ? "name-error"
                : undefined
            }
            className={getInputClassName("name")}
          />

          {touched.name && getError("name", form.name) && (
            <p
              id="name-error"
              className="mt-1.5 text-xs font-medium text-red-600"
              role="alert"
            >
              {getError("name", form.name)}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Phone
          </label>

          <input
            id="phone"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={onChange}
            onBlur={handleBlur}
            required
            maxLength={20}
            autoComplete="tel"
            inputMode="tel"
            placeholder="+92 300 1234567"
            aria-invalid={Boolean(
              touched.phone && getError("phone", form.phone),
            )}
            aria-describedby={
              touched.phone && getError("phone", form.phone)
                ? "phone-error"
                : undefined
            }
            className={getInputClassName("phone")}
          />

          {touched.phone && getError("phone", form.phone) && (
            <p
              id="phone-error"
              className="mt-1.5 text-xs font-medium text-red-600"
              role="alert"
            >
              {getError("phone", form.phone)}
            </p>
          )}
        </div>

        {/* Postal Code */}
        <div>
          <label
            htmlFor="postalCode"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Postal Code
          </label>

          <input
            id="postalCode"
            type="text"
            name="postalCode"
            value={form.postalCode}
            onChange={onChange}
            onBlur={handleBlur}
            required
            maxLength={20}
            autoComplete="postal-code"
            inputMode="numeric"
            placeholder="52000"
            aria-invalid={Boolean(
              touched.postalCode && getError("postalCode", form.postalCode),
            )}
            aria-describedby={
              touched.postalCode && getError("postalCode", form.postalCode)
                ? "postalCode-error"
                : undefined
            }
            className={getInputClassName("postalCode")}
          />

          {touched.postalCode && getError("postalCode", form.postalCode) && (
            <p
              id="postalCode-error"
              className="mt-1.5 text-xs font-medium text-red-600"
              role="alert"
            >
              {getError("postalCode", form.postalCode)}
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <label
            htmlFor="city"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            City
          </label>

          <input
            id="city"
            type="text"
            name="city"
            value={form.city}
            onChange={onChange}
            onBlur={handleBlur}
            required
            minLength={2}
            maxLength={100}
            autoComplete="address-level2"
            placeholder="Gujranwala"
            aria-invalid={Boolean(touched.city && getError("city", form.city))}
            aria-describedby={
              touched.city && getError("city", form.city)
                ? "city-error"
                : undefined
            }
            className={getInputClassName("city")}
          />

          {touched.city && getError("city", form.city) && (
            <p
              id="city-error"
              className="mt-1.5 text-xs font-medium text-red-600"
              role="alert"
            >
              {getError("city", form.city)}
            </p>
          )}
        </div>

        {/* Complete Address */}
        <div className="md:col-span-2">
          <label
            htmlFor="address"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Complete Address
          </label>

          <textarea
            id="address"
            name="address"
            value={form.address}
            onChange={onChange}
            onBlur={handleBlur}
            required
            minLength={5}
            maxLength={300}
            rows={4}
            autoComplete="street-address"
            placeholder="Enter your complete delivery address"
            aria-invalid={Boolean(
              touched.address && getError("address", form.address),
            )}
            aria-describedby={
              touched.address && getError("address", form.address)
                ? "address-error"
                : undefined
            }
            className={`${getInputClassName("address")} resize-none leading-6`}
          />

          {touched.address && getError("address", form.address) && (
            <p
              id="address-error"
              className="mt-1.5 text-xs font-medium text-red-600"
              role="alert"
            >
              {getError("address", form.address)}
            </p>
          )}

          <p className="mt-1.5 text-xs text-slate-400">
            Include house/building number, street, area, and any useful delivery
            details.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ShippingAddressForm;
