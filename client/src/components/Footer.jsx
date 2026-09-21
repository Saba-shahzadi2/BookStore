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

  const quickLinks = [
    {
      label: "Home",
      to: "/",
    },
    {
      label: "Books",
      to: "/books",
    },
    {
      label: "About Us",
      to: "/about",
    },
    {
      label: "Contact",
      to: "/contact",
    },
  ];

  const customerLinks = [
    {
      label: "My Account",
      to: "/profile",
    },
    {
      label: "Wishlist",
      to: "/wishlist",
    },
    {
      label: "Shopping Cart",
      to: "/cart",
    },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* =========================================
              BRAND
          ========================================= */}

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

            <div
              className="mt-6 flex items-center gap-2.5"
              aria-label="Social media links"
            >
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
                    aria-label={`Visit BookStore on ${social.label}`}
                    title={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-all duration-200 hover:border-slate-950 hover:bg-slate-950 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-950/10"
                  >
                    <Icon size={17} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* =========================================
              QUICK LINKS
          ========================================= */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.4,
              delay: 0.05,
            }}
          >
            <h3 className="text-sm font-bold text-slate-950">Quick Links</h3>

            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="rounded-md text-sm text-slate-500 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* =========================================
              CUSTOMER
          ========================================= */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.4,
              delay: 0.1,
            }}
          >
            <h3 className="text-sm font-bold text-slate-950">Customer</h3>

            <ul className="mt-4 space-y-3">
              {customerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="rounded-md text-sm text-slate-500 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              {/* Support */}

              <li>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-md text-sm text-slate-500 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  <FiMail size={15} aria-hidden="true" />
                  Support
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* =========================================
            BOTTOM
        ========================================= */}

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            © {currentYear} BookStore. All rights reserved.
          </p>

          <nav
            aria-label="Legal navigation"
            className="flex flex-wrap gap-x-5 gap-y-2"
          >
            <Link
              to="/privacy"
              className="rounded-md text-sm text-slate-400 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="rounded-md text-sm text-slate-400 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              Terms &amp; Conditions
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
