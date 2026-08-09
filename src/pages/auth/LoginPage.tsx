import toast from "react-hot-toast";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { LoginCredentials } from "@/types/auth.types";
import { APP_ROUTES } from "@/constants/appRoutes.constants";
import { Form, Input, Button, Card, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLoginSubmit = async (values: LoginCredentials) => {
        setLoading(true);

        try {
            const response = await authService.login(values);

            if (!response.success || !response.data) {
                toast.error(response.message || "Login failed");
                return;
            }

            const { accessToken, authenticatedUser } = response.data;

            login(accessToken, authenticatedUser);

            toast.success(response.message || "Login successful");

            if (authenticatedUser.role === "ADMIN") {
                navigate(APP_ROUTES.adminDashboard);
            }
            else {
                navigate(APP_ROUTES.studentHome);
            }
        }
        catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                "Login failed. Please check your email and password."
            );
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-md rounded-xl border-0 shadow-lg">
                <div className="mb-6 text-center">
                    <Title level={3} className="!mb-1">
                        Student Management
                    </Title>

                    <Text type="secondary">
                        Enter your email and password to continue.
                    </Text>
                </div>

                <Form<LoginCredentials>
                    layout="vertical"
                    onFinish={handleLoginSubmit}
                    autoComplete="off"
                    size="large"
                >
                    {/* Email input */}
                    <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your email.",
                            },
                            {
                                type: "email",
                                message: "Please enter a valid email address.",
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="admin@example.com"
                        />
                    </Form.Item>

                    {/* Password input */}
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your password.",
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Enter your password"
                        />
                    </Form.Item>

                    {/* Login button */}
                    <Form.Item className="!mt-6 !mb-2">
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            className="h-11"
                            style={{ backgroundColor: "#1677ff" }}
                        >
                            Sign In
                        </Button>
                    </Form.Item>
                </Form>

                {/* Register Account Navigation Link */}
                <div className="mt-4 text-center">
                    <Text type="secondary">Don't have an account? </Text>
                    <Link
                        to={APP_ROUTES.register}
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Register here
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;