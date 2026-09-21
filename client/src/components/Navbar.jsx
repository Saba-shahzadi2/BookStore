import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBookOpen,
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiHeart,
  FiGrid,
  FiPackage,
  FiMail,
  FiInfo,
} from "react-icons/fi";

import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = isAuthenticated && user?.role === "admin";

  /* =========================================
     CLOSE MOBILE MENU ON ESCAPE
  ========================================= */

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  /* =========================================
     LOCK BODY SCROLL WHEN MOBILE MENU IS OPEN
  ========================================= */

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen]);

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);

    navigate("/", {
      replace: true,
    });
  };

  /* =========================================
     MOBILE MENU
  ========================================= */

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  /* =========================================
     NAVIGATION CLASSES
  ========================================= */

  const desktopNavLinkClass = ({ isActive }) =>
    `relative inline-flex items-center py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
      isActive ? "text-amber-600" : "text-slate-600 hover:text-slate-950"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-amber-50 text-amber-700"
        : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
      <nav
        className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:min-h-[4.5rem] sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* =========================================
            LOGO
        ========================================= */}

        <Link
          to="/"
          onClick={closeMobileMenu}
          className="group flex items-center gap-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          aria-label="BookStore home"
        >
          <motion.span
            whileHover={{ rotate: -3, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm sm:h-10 sm:w-10"
          >
            <FiBookOpen size={20} aria-hidden="true" />
          </motion.span>

          <span className="text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
            BookStore
          </span>
        </Link>

        {/* =========================================
            DESKTOP NAVIGATION
        ========================================= */}

        <div className="hidden items-center gap-7 md:flex lg:gap-8">
          {/* Home */}

          <NavLink to="/" end className={desktopNavLinkClass}>
            {({ isActive }) => (
              <>
                Home
                {isActive && (
                  <motion.span
                    layoutId="desktop-nav-indicator"
                    className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-amber-500"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}
              </>
            )}
          </NavLink>
          {/* Books */}

          {!isAdmin && (
            <NavLink to="/books" className={desktopNavLinkClass}>
              {({ isActive }) => (
                <>
                  Books
                  {isActive && (
                    <motion.span
                      layoutId="desktop-nav-indicator"
                      className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-amber-500"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          )}

          {/* Contact */}

          <NavLink to="/contact" className={desktopNavLinkClass}>
            {({ isActive }) => (
              <>
                Contact
                {isActive && (
                  <motion.span
                    layoutId="desktop-nav-indicator"
                    className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-amber-500"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}
              </>
            )}
          </NavLink>
          {/* About Us */}
          <NavLink to="/about" className={desktopNavLinkClass}>
            {({ isActive }) => (
              <>
                About Us
                {isActive && (
                  <motion.span
                    layoutId="desktop-nav-indicator"
                    className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-amber-500"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}
              </>
            )}
          </NavLink>
          {/* Books */}

          {/* Customer Navigation */}

          {isAuthenticated && !isAdmin && (
            <>
              {/* Orders */}

              <NavLink to="/orders" className={desktopNavLinkClass}>
                {({ isActive }) => (
                  <>
                    Orders
                    {isActive && (
                      <motion.span
                        layoutId="desktop-nav-indicator"
                        className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-amber-500"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>

              {/* Wishlist */}

              <NavLink to="/wishlist" className={desktopNavLinkClass}>
                {({ isActive }) => (
                  <>
                    Wishlist
                    {isActive && (
                      <motion.span
                        layoutId="desktop-nav-indicator"
                        className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-amber-500"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </>
          )}

          {/* Admin Navigation */}

          {isAdmin && (
            <NavLink to="/admin" end className={desktopNavLinkClass}>
              {({ isActive }) => (
                <>
                  Admin Dashboard
                  {isActive && (
                    <motion.span
                      layoutId="desktop-nav-indicator"
                      className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-amber-500"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          )}
        </div>

        {/* =========================================
            RIGHT SIDE
        ========================================= */}

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cart */}

          {!isAdmin && (
            <Link
              to="/cart"
              onClick={closeMobileMenu}
              className="relative rounded-xl p-2.5 text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              aria-label={`Shopping cart with ${cartCount} ${
                cartCount === 1 ? "item" : "items"
              }`}
            >
              <FiShoppingCart size={21} aria-hidden="true" />

              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-slate-950 ring-2 ring-white"
                  aria-hidden="true"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </motion.span>
              )}
            </Link>
          )}

          {/* =========================================
              DESKTOP AUTHENTICATION
          ========================================= */}

          <div className="hidden items-center gap-2.5 md:flex">
            {isAuthenticated ? (
              <>
                {/* Admin Dashboard */}

                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20"
                  >
                    <FiGrid size={17} aria-hidden="true" />

                    <span>Dashboard</span>
                  </Link>
                ) : (
                  /* Customer Profile */

                  <Link
                    to="/profile"
                    className="flex max-w-44 items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    aria-label="Open profile"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                      <FiUser size={17} aria-hidden="true" />
                    </div>

                    <span className="truncate text-sm font-semibold text-slate-700">
                      Hi, {user?.name || "User"}
                    </span>
                  </Link>
                )}

                {/* Logout */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
                >
                  <FiLogOut size={17} aria-hidden="true" />

                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                {/* Login */}

                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
                >
                  <FiUser size={17} aria-hidden="true" />

                  <span>Login</span>
                </Link>

                {/* Register */}

                <Link
                  to="/register"
                  className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* =========================================
              MOBILE MENU BUTTON
          ========================================= */}

          <button
            type="button"
            onClick={toggleMobileMenu}
            className="rounded-xl p-2.5 text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 md:hidden"
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileMenuOpen ? "close" : "menu"}
                initial={{
                  opacity: 0,
                  rotate: -45,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  rotate: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  rotate: 45,
                  scale: 0.8,
                }}
                transition={{ duration: 0.15 }}
                className="flex"
              >
                {mobileMenuOpen ? (
                  <FiX size={23} aria-hidden="true" />
                ) : (
                  <FiMenu size={23} aria-hidden="true" />
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* =========================================
          MOBILE NAVIGATION
      ========================================= */}

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-200 bg-white shadow-sm md:hidden"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: -8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              transition={{ duration: 0.2 }}
              className="mx-auto max-w-7xl px-4 py-4 sm:px-6"
            >
              <div className="space-y-1">
                {/* Home */}

                <NavLink
                  to="/"
                  end
                  onClick={closeMobileMenu}
                  className={mobileNavLinkClass}
                >
                  <FiBookOpen size={18} aria-hidden="true" />
                  Home
                </NavLink>

                {!isAdmin && (
                  <>
                    {/* Books */}

                    <NavLink
                      to="/books"
                      onClick={closeMobileMenu}
                      className={mobileNavLinkClass}
                    >
                      <FiBookOpen size={18} aria-hidden="true" />
                      Books
                    </NavLink>

                    {isAuthenticated && (
                      <>
                        {/* Orders */}

                        <NavLink
                          to="/orders"
                          onClick={closeMobileMenu}
                          className={mobileNavLinkClass}
                        >
                          <FiPackage size={18} aria-hidden="true" />
                          My Orders
                        </NavLink>

                        {/* Wishlist */}

                        <NavLink
                          to="/wishlist"
                          onClick={closeMobileMenu}
                          className={mobileNavLinkClass}
                        >
                          <FiHeart size={18} aria-hidden="true" />
                          Wishlist
                        </NavLink>

                        {/* Cart */}

                        <NavLink
                          to="/cart"
                          onClick={closeMobileMenu}
                          className={mobileNavLinkClass}
                        >
                          <FiShoppingCart size={18} aria-hidden="true" />

                          <span className="flex flex-1 items-center justify-between">
                            Shopping Cart
                            {cartCount > 0 && (
                              <span
                                className="flex min-w-6 items-center justify-center rounded-full bg-amber-500 px-2 py-1 text-xs font-bold text-slate-950"
                                aria-label={`${cartCount} ${
                                  cartCount === 1 ? "item" : "items"
                                } in cart`}
                              >
                                {cartCount > 99 ? "99+" : cartCount}
                              </span>
                            )}
                          </span>
                        </NavLink>
                      </>
                    )}
                  </>
                )}

                {/* Contact */}

                <NavLink
                  to="/contact"
                  onClick={closeMobileMenu}
                  className={mobileNavLinkClass}
                >
                  <FiMail size={18} aria-hidden="true" />
                  Contact
                </NavLink>
                {/* About Us */}
                <NavLink
                  to="/about"
                  onClick={closeMobileMenu}
                  className={mobileNavLinkClass}
                >
                  <FiInfo size={18} aria-hidden="true" />
                  About Us
                </NavLink>

                {/* Customer Navigation */}

                {/* =========================================
                    ADMIN NAVIGATION
                ========================================= */}

                {isAdmin && (
                  <div className="border-t border-slate-200 pt-3">
                    <NavLink
                      to="/admin"
                      end
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-slate-950 text-white"
                            : "bg-slate-950 text-white hover:bg-slate-800"
                        }`
                      }
                    >
                      <FiGrid size={18} aria-hidden="true" />
                      Admin Dashboard
                    </NavLink>
                  </div>
                )}
              </div>

              {/* =========================================
                  AUTHENTICATED USER
              ========================================= */}

              {isAuthenticated ? (
                <div className="mt-4 border-t border-slate-200 pt-4">
                  {/* Profile */}

                  <Link
                    to={isAdmin ? "/admin/profile" : "/profile"}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                      <FiUser size={18} aria-hidden="true" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-500">
                        {isAdmin ? "Administrator" : "Welcome"}
                      </p>

                      <p className="truncate text-sm font-bold text-slate-800">
                        {user?.name || "User"}
                      </p>
                    </div>
                  </Link>

                  {/* Logout */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
                  >
                    <FiLogOut size={18} aria-hidden="true" />

                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                /* =========================================
                   GUEST AUTHENTICATION
                ========================================= */

                <div className="mt-4 grid gap-2 border-t border-slate-200 pt-4">
                  {/* Login */}

                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
                  >
                    <FiUser size={17} aria-hidden="true" />

                    <span>Login</span>
                  </Link>

                  {/* Register */}

                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20"
                  >
                    Register
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
