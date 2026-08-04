import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute.tsx";

// Active Implemented Pages
import LoginPage from "@/pages/auth/LoginPage.tsx";
import UnauthorizedPage from "@/pages/common/UnauthorizedPage.tsx";

// PURPOSE: Centralized App Router mapping currently implemented authentication & role routes.
export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* 1. PUBLIC ROUTES */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* 2. PROTECTED ADMIN ROUTES (Only for ADMIN Role) */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                {/* Placeholder until we build StudentListPage UI in the next file */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <div className="p-8 text-xl font-semibold">
                            👑 Welcome Admin! (Student Management Table coming next)
                        </div>
                    }
                />
            </Route>

            {/* 3. PROTECTED STUDENT ROUTES (Only for STUDENT Role) */}
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

            {/* 4. DEFAULT REDIRECTS */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/unauthorized" replace />} />
        </Routes>
    );
};

export default AppRoutes;