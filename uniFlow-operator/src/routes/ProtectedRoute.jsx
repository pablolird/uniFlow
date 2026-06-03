import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/context/AuthContext";
import SpinnerPage from "../components/SpinnerPage";

export default function ProtectedRoute() {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return <SpinnerPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
