import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function ProtectedRoute() {
  const { state } = useAuth();
  console.log(state); // validar isso depois
  if (state.isLoading == false && !state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
