import React from "react";
import { Button, Result } from "antd";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { APP_ROUTES } from "../../constants/appRoutes.constants";

export const NotFound: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();

    const isForbidden = location.state?.status === 403;

    const status = isForbidden ? "403" : "404";
    const title = isForbidden ? "403 - Access Denied" : "404 - Page Not Found";
    const subTitle = isForbidden
        ? "Sorry, you do not have permission to access this page."
        : "Sorry, the page you visited does not exist or has been moved.";

    const handleBackToDashboard = () => {
        if (currentUser?.role === "ADMIN") {
            navigate(APP_ROUTES.adminDashboard);
        }
        else if (currentUser?.role === "STUDENT") {
            navigate(APP_ROUTES.studentHome);
        }
        else {
            navigate(APP_ROUTES.login);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full">
                <Result
                    status={status}
                    title={title}
                    subTitle={subTitle}
                    extra={
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleBackToDashboard}
                            style={{ backgroundColor: "#1677ff" }}
                        >
                            Back to Home / Dashboard
                        </Button>
                    }
                />
            </div>
        </div>
    );
};

export default NotFound;