import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const UnauthorizedPage: React.FC = () => {

    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const handleBackToDashboard = () => {
        if (currentUser?.role === "ADMIN") {
            navigate("/admin/dashboard");
        } else if (currentUser?.role === "STUDENT") {
            navigate("/student/dashboard");
        } else {
            navigate("/login");
        }
    }

    return (
        <div className="flex items-center justify-center">
            <Result
                status="403"
                title="403 - Access Denied"
                subTitle="Sorry, you do not have permission to access this page."
                extra={
                    <Button type="primary" onClick={handleBackToDashboard}>
                        Back to Dashboard
                    </Button>
                }
            />
        </div>
    );
};

export default UnauthorizedPage;