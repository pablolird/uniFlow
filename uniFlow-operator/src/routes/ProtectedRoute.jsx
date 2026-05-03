import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";

export default function ProtectedRoute() {
  const { accessToken, authLoading } = useAuth();

  if (authLoading) {
    return <Spinner />;
  }

  if (!accessToken) {
    console.log("You shall not pass");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
