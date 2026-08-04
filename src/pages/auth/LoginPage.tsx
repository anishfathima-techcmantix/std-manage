import React, { useState } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_Instance } from "../../api/axios.instance.js";
import { useAuth } from "../../context/AuthContext.js";

const { Title, Text } = Typography;

// PURPOSE: Login form component handling authentication, token storage, and role-based navigation.
export const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // PURPOSE: Handles form submission, triggers Login API, and routes based on User Role.
  const handleLoginSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await API_Instance.post("/auth/login", values);

      if (response.data.success) {
        const { accessToken, authenticatedUser } = response.data.data;

        // Store session in AuthContext & LocalStorage
        login(accessToken, authenticatedUser);
        toast.success(response.data.message || "Logged in successfully!");

        // Role-based navigation
        if (authenticatedUser.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Login failed! Please check your credentials.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-xl border-0">
        <div className="text-center mb-6">
          <Title level={3} className="!mb-1 text-gray-800">
            Student Management
          </Title>
          <Text type="secondary">Enter your credentials to access your account</Text>
        </div>

        <Form
          name="loginForm"
          layout="vertical"
          onFinish={handleLoginSubmit}
          autoComplete="off"
          size="large"
        >
          {/* Email Field */}
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="admin@example.com" />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="••••••••"
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item className="!mt-8">
            <Button type="primary" htmlType="submit" block loading={loading} className="h-11 font-medium text-base">
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;