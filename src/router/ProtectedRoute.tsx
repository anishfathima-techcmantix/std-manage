import { UserRole } from "../types/auth.types";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { APP_ROUTES } from "../constants/appRoutes.constants";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { currentUser, isLoading } = useAuth();

  // Show a loading state while AuthContext fetches profile on page refresh
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  // If not logged in, redirect to Login page
  if (!currentUser) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  // If route requires specific role & user doesn't have it, redirect to Unauthorized page
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to={APP_ROUTES.UNAUTHORIZED} replace />;
  }

  // Render child routes
  return <Outlet />;
};