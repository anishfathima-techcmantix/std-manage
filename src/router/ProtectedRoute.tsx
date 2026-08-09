import React from "react";
import { Spin } from "antd";
import { UserRole } from "../types/auth.types";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { APP_ROUTES } from "../constants/appRoutes.constants";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Spin size="large" description="Authenticating..." />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={APP_ROUTES.login} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to={APP_ROUTES.notFound} replace />;
  }

  return <Outlet />;
};