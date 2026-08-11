import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { APP_ROUTES } from "@/constants/appRoutes.constants";

// Pages & Components
import LoginPage from "@/pages/auth/LoginPage";
import NotFound from "@/pages/common/NotFound";
import { ProtectedRoute } from "./ProtectedRoute";
import RegisterPage from "@/pages/auth/RegisterPage";

export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* 1. Default Root Redirect: '/' to '/login' */}
            <Route path="/" element={<Navigate to={APP_ROUTES.login} replace />} />

            {/* 2. Public Auth Routes */}
            <Route path={APP_ROUTES.login} element={<LoginPage />} />
            <Route path={APP_ROUTES.register} element={<RegisterPage />} />

            {/* 3. Protected Routes (Admin) */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
            </Route>

            {/* 4. Protected Routes (Student) */}
            <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
                <Route path="/student/home" element={<div>Student Home</div>} />
            </Route>

            {/* 4. Catch-all / 404 Page */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;