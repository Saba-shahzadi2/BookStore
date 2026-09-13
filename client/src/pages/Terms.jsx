import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiCheckCircle,
  FiFileText,
  FiMail,
  FiShoppingBag,
  FiUserCheck,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import SEO from "../components/SEO";

const Terms = () => {
  return (
    <>
      <SEO
        title="Terms & Conditions | BookStore"
        description="Read the Terms and Conditions for using the BookStore online bookstore."
      />

      <main className="bg-slate-50">
        {/* Hero */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="max-w-3xl"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                <FiFileText size={16} aria-hidden="true" />
                Terms & Conditions
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Terms & Conditions
              </h1>

              <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
                These terms explain the rules and conditions that apply when
                using the BookStore application.
              </p>

              <p className="mt-4 text-sm text-slate-500">
                Last updated: September 2026
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10"
          >
            <div className="space-y-10">
              {/* Acceptance */}
              <section>
                <SectionTitle icon={<FiCheckCircle />}>
                  1. Acceptance of Terms
                </SectionTitle>

                <SectionText>
                  By accessing or using BookStore, you agree to comply with
                  these Terms & Conditions. If you do not agree with these
                  terms, please do not use the service.
                </SectionText>
              </section>

              {/* Account */}
              <section>
                <SectionTitle icon={<FiUserCheck />}>
                  2. User Accounts
                </SectionTitle>

                <SectionText>
                  Some features require you to create an account. You are
                  responsible for providing accurate information and keeping
                  your account credentials secure.
                </SectionText>

                <BulletList
                  items={[
                    "Provide accurate and current account information.",
                    "Keep your password confidential.",
                    "Do not use another person's account without authorization.",
                    "Notify us if you believe your account has been compromised.",
                  ]}
                />
              </section>

              {/* Shopping */}
              <section>
                <SectionTitle icon={<FiShoppingBag />}>
                  3. Books, Prices & Availability
                </SectionTitle>

                <SectionText>
                  BookStore provides information about books including titles,
                  authors, descriptions, prices, images, categories, and stock
                  availability.
                </SectionText>

                <SectionText>
                  We make reasonable efforts to keep product information
                  accurate. However, prices, availability, descriptions, and
                  other product information may change without prior notice.
                </SectionText>
              </section>

              {/* Orders */}
              <section>
                <SectionTitle>4. Orders</SectionTitle>

                <SectionText>
                  When you place an order, you are requesting the purchase of
                  the selected products according to the information shown
                  during checkout.
                </SectionText>

                <SectionText>
                  Orders may be reviewed, confirmed, cancelled, or rejected when
                  necessary, including in situations involving incorrect
                  information, unavailable stock, suspected misuse, or technical
                  errors.
                </SectionText>
              </section>

              {/* Shipping */}
              <section>
                <SectionTitle>5. Shipping & Delivery</SectionTitle>

                <SectionText>
                  Customers are responsible for providing complete and accurate
                  shipping information. Incorrect or incomplete information may
                  cause delivery delays or prevent successful delivery.
                </SectionText>

                <SectionText>
                  Delivery times may vary depending on availability, location,
                  courier services, and other circumstances outside the direct
                  control of BookStore.
                </SectionText>
              </section>

              {/* Payment */}
              <section>
                <SectionTitle>6. Payments</SectionTitle>

                <SectionText>
                  BookStore may provide different payment options, such as cash
                  on delivery and online payment methods, depending on the
                  application's configuration.
                </SectionText>

                <SectionText>
                  Online payment functionality may require third-party payment
                  providers. Transactions handled by those providers may also be
                  subject to their own terms and policies.
                </SectionText>
              </section>

              {/* Cancellation */}
              <section>
                <SectionTitle>7. Order Cancellation</SectionTitle>

                <SectionText>
                  Cancellation availability may depend on the current status of
                  an order. Orders that have already progressed to later
                  processing or delivery stages may not be eligible for
                  cancellation.
                </SectionText>

                <SectionText>
                  If cancellation functionality is available in your account,
                  use the cancellation option provided by BookStore.
                </SectionText>
              </section>

              {/* Acceptable use */}
              <section>
                <SectionTitle>8. Acceptable Use</SectionTitle>

                <SectionText>
                  You agree not to misuse the BookStore application or attempt
                  to interfere with its normal operation.
                </SectionText>

                <BulletList
                  items={[
                    "Do not attempt unauthorized access to accounts or systems.",
                    "Do not submit malicious, misleading, or fraudulent information.",
                    "Do not interfere with the application's availability or security.",
                    "Do not use the service for unlawful activities.",
                    "Do not abuse APIs, forms, or other application functionality.",
                  ]}
                />
              </section>

              {/* Intellectual property */}
              <section>
                <SectionTitle>9. Intellectual Property</SectionTitle>

                <SectionText>
                  The BookStore application, including its design, interface,
                  branding, original content, and software components, may be
                  protected by applicable intellectual-property laws.
                </SectionText>

                <SectionText>
                  You may not copy, reproduce, modify, distribute, or
                  commercially exploit protected content without appropriate
                  authorization.
                </SectionText>
              </section>

              {/* Third party */}
              <section>
                <SectionTitle>10. Third-Party Services</SectionTitle>

                <SectionText>
                  BookStore may integrate with third-party services such as
                  email providers, payment providers, hosting platforms, or
                  other external services.
                </SectionText>

                <SectionText>
                  We are not responsible for the independent policies,
                  availability, or practices of third-party services.
                </SectionText>
              </section>

              {/* Availability */}
              <section>
                <SectionTitle>11. Service Availability</SectionTitle>

                <SectionText>
                  We aim to keep BookStore available and reliable, but we do not
                  guarantee uninterrupted access. The service may temporarily
                  become unavailable because of maintenance, technical problems,
                  hosting issues, or circumstances beyond our control.
                </SectionText>
              </section>

              {/* Liability */}
              <section>
                <SectionTitle>12. Limitation of Liability</SectionTitle>

                <SectionText>
                  To the extent permitted by applicable law, BookStore is not
                  responsible for losses resulting from unauthorized use,
                  inaccurate information supplied by users, third-party
                  services, delivery delays, or temporary service interruptions.
                </SectionText>
              </section>

              {/* Changes */}
              <section>
                <SectionTitle>13. Changes to These Terms</SectionTitle>

                <SectionText>
                  We may update these Terms & Conditions when the application,
                  services, or applicable requirements change. Updated terms
                  will be published on this page with a revised date.
                </SectionText>
              </section>

              {/* Contact */}
              <section className="rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                <SectionTitle icon={<FiMail />}>14. Contact Us</SectionTitle>

                <SectionText>
                  If you have questions about these Terms & Conditions, please
                  contact the BookStore support team.
                </SectionText>

                <a
                  href="mailto:support@bookstore.com"
                  className="mt-4 inline-flex items-center gap-2 font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 transition hover:decoration-slate-900"
                >
                  <FiMail size={16} aria-hidden="true" />
                  support@bookstore.com
                </a>
              </section>
            </div>
          </motion.div>

          {/* Footer CTA */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:flex-row sm:text-left">
            <div className="flex items-center gap-3">
              <FiBookOpen
                className="hidden text-slate-700 sm:block"
                size={20}
                aria-hidden="true"
              />

              <p className="text-sm text-slate-600">
                Ready to explore the BookStore?
              </p>
            </div>

            <Link
              to="/books"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Browse Books
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

const SectionTitle = ({ children, icon }) => {
  return (
    <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 sm:text-xl">
      {icon && (
        <span className="shrink-0 text-slate-700" aria-hidden="true">
          {icon}
        </span>
      )}

      <span>{children}</span>
    </h2>
  );
};

const SectionText = ({ children }) => {
  return (
    <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
      {children}
    </p>
  );
};

const BulletList = ({ items }) => {
  return (
    <ul className="mt-4 space-y-3 pl-5 text-sm leading-7 text-slate-600 sm:text-base">
      {items.map((item) => (
        <li key={item} className="list-disc pl-1">
          {item}
        </li>
      ))}
    </ul>
  );
};

export default Terms;
