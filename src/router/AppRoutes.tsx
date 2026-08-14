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
            {/* Root */}
            <Route path="/" element={<Navigate to={APP_ROUTES.login} replace />} />

            {/* Public */}
            <Route path={APP_ROUTES.login} element={<LoginPage />} />
            <Route path={APP_ROUTES.register} element={<RegisterPage />} />

            {/* Admin */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route path={APP_ROUTES.adminDashboard} element={<div>Admin Dashboard</div>} />
            </Route>

            {/* Student */}
            <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
                <Route path={APP_ROUTES.studentHome} element={<div>Student Home</div>} />
            </Route>

            {/* 403 / 404 Pages */}
            <Route path={APP_ROUTES.notFound} element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;