import React from "react";
import { Spin } from "antd";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";

interface ProtectedRouteProps {
  allowedRoles?: Array<"ADMIN" | "STUDENT">;
}

// Guards routes by checking authentication status and user roles.
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { currentUser, isLoading } = useAuth();

  // Show Ant Design Loading Spinner while checking auth state from localStorage
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Spin size="large" description="Verifying session..." />
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If route requires specific role & current user doesn't match, redirect
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized -> Render nested child routes
  return <Outlet />;
};