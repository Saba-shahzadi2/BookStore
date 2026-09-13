import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../context/useAuth";
import Loader from "../common/Loader";

const AdminProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader text="Checking admin access..." fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
