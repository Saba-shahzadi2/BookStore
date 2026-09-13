import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";

import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import ScrollToTop from "./components/common/ScrollToTop";

// Public pages
import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import About from "./pages/About";

// Protected customer pages
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderDetails from "./pages/OrderDetails";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBooks from "./pages/admin/AdminBooks";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProfile from "./pages/admin/AdminProfile";

/* =========================================
   CUSTOMER LAYOUT
========================================= */

const CustomerLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

/* =========================================
   APP
========================================= */

const App = () => {
  return (
    <BrowserRouter>
      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />

      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              {/* =================================
                  CUSTOMER / PUBLIC LAYOUT
              ================================== */}

              <Route element={<CustomerLayout />}>
                {/* Public Routes */}

                <Route path="/" element={<Home />} />

                <Route path="/books" element={<Books />} />

                <Route path="/books/:id" element={<BookDetails />} />

                <Route path="/about" element={<About />} />

                <Route path="/contact" element={<Contact />} />

                <Route path="/privacy" element={<Privacy />} />

                <Route path="/terms" element={<Terms />} />

                <Route path="/register" element={<Register />} />

                <Route path="/login" element={<Login />} />

                {/* =================================
                    FORGOT PASSWORD FLOW
                ================================== */}

                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route path="/verify-otp" element={<VerifyOTP />} />

                <Route path="/reset-password" element={<ResetPassword />} />

                {/* =================================
                    PROTECTED CUSTOMER ROUTES
                ================================== */}

                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<Profile />} />

                  <Route path="/cart" element={<Cart />} />

                  <Route path="/wishlist" element={<Wishlist />} />

                  <Route path="/checkout" element={<Checkout />} />

                  <Route path="/orders" element={<Orders />} />

                  <Route path="/orders/:id" element={<OrderDetails />} />
                </Route>

                {/* Customer 404 */}

                <Route path="*" element={<NotFound />} />
              </Route>

              {/* =================================
                  ADMIN ROUTES
              ================================== */}

              <Route element={<AdminProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />

                  <Route path="books" element={<AdminBooks />} />

                  <Route path="orders" element={<AdminOrders />} />

                  <Route path="users" element={<AdminUsers />} />

                  <Route path="profile" element={<AdminProfile />} />
                </Route>
              </Route>
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
