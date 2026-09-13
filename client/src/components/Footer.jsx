import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiFacebook,
  FiGithub,
  FiInstagram,
  FiMail,
  FiTwitter,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      label: "Facebook",
      icon: FiFacebook,
      href: null,
    },
    {
      label: "Twitter",
      icon: FiTwitter,
      href: null,
    },
    {
      label: "Instagram",
      icon: FiInstagram,
      href: null,
    },
    {
      label: "GitHub",
      icon: FiGithub,
      href: "https://github.com/Saba-shahzadi2/BookStore",
    },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2"
          >
            <Link
              to="/"
              className="group inline-flex items-center gap-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              aria-label="BookStore home"
            >
              <motion.span
                whileHover={{ rotate: -3, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm"
              >
                <FiBookOpen size={19} aria-hidden="true" />
              </motion.span>

              <span className="text-xl font-bold tracking-tight text-slate-950">
                BookStore
              </span>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
              Discover your next great read. Browse our collection of books
              across different categories and find something you&apos;ll love.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-2.5">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                if (!social.href) {
                  return (
                    <span
                      key={social.label}
                      aria-label={`${social.label} coming soon`}
                      title={`${social.label} coming soon`}
                      className="flex h-10 w-10 cursor-default items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400"
                    >
                      <Icon size={17} aria-hidden="true" />
                    </span>
                  );
                }

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-all duration-200 hover:border-slate-950 hover:bg-slate-950 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-950/10"
                  >
                    <Icon size={17} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <h3 className="text-sm font-bold text-slate-950">Quick Links</h3>

            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-slate-500 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/books"
                  className="text-sm text-slate-500 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  Books
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="text-sm text-slate-500 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-sm text-slate-500 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Customer */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h3 className="text-sm font-bold text-slate-950">Customer</h3>

            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/profile"
                  className="text-sm text-slate-500 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  My Account
                </Link>
              </li>

              <li>
                <Link
                  to="/wishlist"
                  className="text-sm text-slate-500 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  Wishlist
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="text-sm text-slate-500 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  Shopping Cart
                </Link>
              </li>

              <li>
                <a
                  href="mailto:support@bookstore.com"
                  className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  <FiMail size={15} aria-hidden="true" />
                  Support
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            © {currentYear} BookStore. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <span className="cursor-default text-sm text-slate-400 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/20">
              <Link to="/privacy">Privacy Policy</Link>
            </span>

            <span className="cursor-default text-sm text-slate-400 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/20">
              <Link to="/terms">Terms &amp; Conditions</Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
