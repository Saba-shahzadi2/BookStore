import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiDatabase,
  FiLock,
  FiMail,
  FiShield,
  FiUserCheck,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import SEO from "../components/SEO";

const Privacy = () => {
  return (
    <>
      <SEO
        title="Privacy Policy | BookStore"
        description="Learn how BookStore collects, uses, protects, and manages your information."
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
                <FiShield size={16} aria-hidden="true" />
                Privacy & Security
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Privacy Policy
              </h1>

              <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
                Your privacy matters to us. This policy explains what
                information BookStore may collect, how it is used, and the steps
                we take to protect it.
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
              {/* Introduction */}
              <section>
                <SectionTitle icon={<FiBookOpen />}>
                  1. Introduction
                </SectionTitle>

                <SectionText>
                  BookStore is an online bookstore application designed to allow
                  users to browse books, manage their accounts, add books to
                  their cart or wishlist, and place orders.
                </SectionText>

                <SectionText>
                  By using BookStore, you agree to the practices described in
                  this Privacy Policy.
                </SectionText>
              </section>

              {/* Information */}
              <section>
                <SectionTitle icon={<FiDatabase />}>
                  2. Information We Collect
                </SectionTitle>

                <SectionText>
                  Depending on how you use the application, we may collect
                  information such as:
                </SectionText>

                <BulletList
                  items={[
                    "Name and email address when you create an account.",
                    "Account and authentication information required to provide secure access.",
                    "Shipping information when you place an order.",
                    "Order details, including purchased books and quantities.",
                    "Cart and wishlist information associated with your account.",
                    "Messages or information you submit through the contact form.",
                  ]}
                />
              </section>

              {/* Usage */}
              <section>
                <SectionTitle icon={<FiUserCheck />}>
                  3. How We Use Your Information
                </SectionTitle>

                <SectionText>Information may be used to:</SectionText>

                <BulletList
                  items={[
                    "Create and manage your BookStore account.",
                    "Authenticate users and protect account access.",
                    "Process and manage orders.",
                    "Provide cart and wishlist functionality.",
                    "Send account-related communications such as password-reset or verification emails.",
                    "Respond to customer questions and support requests.",
                    "Improve the functionality and reliability of the application.",
                    "Prevent misuse, unauthorized access, or fraudulent activity.",
                  ]}
                />
              </section>

              {/* Password */}
              <section>
                <SectionTitle icon={<FiLock />}>
                  4. Account Security
                </SectionTitle>

                <SectionText>
                  Passwords are not intended to be stored as plain text.
                  Authentication credentials are handled using security
                  mechanisms designed to protect user accounts.
                </SectionText>

                <SectionText>
                  However, no online service can guarantee absolute security.
                  Users should choose strong passwords and avoid sharing their
                  account credentials with others.
                </SectionText>
              </section>

              {/* Payments */}
              <section>
                <SectionTitle>5. Payments</SectionTitle>

                <SectionText>
                  BookStore may support multiple payment methods depending on
                  the application's configuration. Payment information should
                  only be submitted through the designated payment process.
                </SectionText>

                <SectionText>
                  This portfolio/demo implementation does not claim to store
                  complete payment-card information. Any real payment gateway
                  integration should be governed by the applicable payment
                  provider's privacy and security policies.
                </SectionText>
              </section>

              {/* Cookies */}
              <section>
                <SectionTitle>6. Cookies & Local Storage</SectionTitle>

                <SectionText>
                  BookStore may use browser storage technologies such as
                  localStorage to maintain authentication and application
                  preferences.
                </SectionText>

                <SectionText>
                  These technologies help the application remember information
                  needed for normal functionality, such as keeping a user signed
                  in.
                </SectionText>
              </section>

              {/* Third Party */}
              <section>
                <SectionTitle>7. Third-Party Services</SectionTitle>

                <SectionText>
                  BookStore may rely on third-party services for infrastructure,
                  email delivery, database hosting, payment processing, or other
                  application functionality.
                </SectionText>

                <SectionText>
                  Those services may process information according to their own
                  terms and privacy policies.
                </SectionText>
              </section>

              {/* Retention */}
              <section>
                <SectionTitle>8. Data Retention</SectionTitle>

                <SectionText>
                  We retain information only for as long as reasonably necessary
                  to provide the application's functionality, maintain records,
                  resolve disputes, comply with applicable requirements, and
                  protect the service.
                </SectionText>
              </section>

              {/* Rights */}
              <section>
                <SectionTitle>9. Your Choices</SectionTitle>

                <SectionText>
                  Depending on the functionality available in the application,
                  you may be able to review or update certain account
                  information through your profile.
                </SectionText>

                <SectionText>
                  If you have questions about your personal information or would
                  like to request assistance, please contact us.
                </SectionText>
              </section>

              {/* Children */}
              <section>
                <SectionTitle>10. Children's Privacy</SectionTitle>

                <SectionText>
                  BookStore is not specifically designed to collect personal
                  information from children. We encourage parents and guardians
                  to supervise children's use of online services.
                </SectionText>
              </section>

              {/* Changes */}
              <section>
                <SectionTitle>11. Changes to This Policy</SectionTitle>

                <SectionText>
                  This Privacy Policy may be updated when the application's
                  functionality, services, or legal requirements change. The
                  updated version will be published on this page with a revised
                  date.
                </SectionText>
              </section>

              {/* Contact */}
              <section className="rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                <SectionTitle icon={<FiMail />}>12. Contact Us</SectionTitle>

                <SectionText>
                  If you have questions about this Privacy Policy, you can
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
            <p className="text-sm text-slate-600">
              Have questions about your account or orders?
            </p>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Contact Support
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

export default Privacy;
