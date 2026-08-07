import React from "react";
import { ProtectedRoute } from "@/router/ProtectedRoute";
import { Routes, Route, Navigate } from "react-router-dom";
import { APP_ROUTES } from "@/constants/appRoutes.constants";

// Active Implemented Pages
import LoginPage from "@/pages/auth/LoginPage";
import UnauthorizedPage from "@/pages/common/UnauthorizedPage";

export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route 
                path={APP_ROUTES.LOGIN}
                element={<LoginPage />}
            />
            <Route 
                path={APP_ROUTES.UNAUTHORIZED}
                element={<UnauthorizedPage />}
            />

            {/* Protected admin routes */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route
                    path="/admin/dashboard"
                    element={
                        <div className="p-8 text-xl font-semibold">
                            👑 Welcome Admin! (Student Management Table coming next)
                        </div>
                    }
                />
            </Route>

            {/* Protected student routes */}
            <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
                <Route
                    path="/student/dashboard"
                    element={
                        <div className="p-8 text-xl font-semibold">
                            🎓 Welcome Student!
                        </div>
                    }
                />
            </Route>

            <Route 
                path={APP_ROUTES.HOME} 
                element={<Navigate to={APP_ROUTES.LOGIN} replace />}
            />
            <Route 
                path={APP_ROUTES.NOT_FOUND} 
                element={<Navigate to={APP_ROUTES.UNAUTHORIZED} replace />} 
            />
        </Routes>
    );
};

export default AppRoutes;