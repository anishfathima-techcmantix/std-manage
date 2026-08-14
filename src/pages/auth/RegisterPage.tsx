import toast from "react-hot-toast";
import ReactCountryFlag from "react-country-flag";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { APP_ROUTES } from "@/constants/appRoutes.constants";
import { countriesService } from "@/services/countries.service";
import { professionsService } from "@/services/professions.service";
import { Form, Input, Select, Button, Card, Typography } from "antd";
import { RegisterFormValues, Country, Profession } from "@/types/types";
import { UserOutlined, MailOutlined, LockOutlined, GlobalOutlined, IdcardOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    const [countries, setCountries] = useState<Country[]>([]);
    const [professions, setProfessions] = useState<Profession[]>([]);

    const [loading, setLoading] = useState(false);
    const [loadingCountries, setLoadingCountries] = useState(true);
    const [loadingProfessions, setLoadingProfessions] = useState(true);

    // Get countries
    useEffect(() => {
        const loadCountries = async () => {
            try {
                setLoadingCountries(true);

                const data = await countriesService.getCountries();

                setCountries(data as Country[]);
            } catch (error: any) {
                console.error("Failed to load countries:", error);

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to load countries."
                );
            } finally {
                setLoadingCountries(false);
            }
        };

        loadCountries();
    }, []);

    // Get professions
    useEffect(() => {
        const loadProfessions = async () => {
            try {
                setLoadingProfessions(true);

                const data = await professionsService.getProfessions();

                setProfessions(data as Profession[]);
            } catch (error: any) {
                console.error("Failed to load professions:", error);

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to load professions."
                );
            } finally {
                setLoadingProfessions(false);
            }
        };

        loadProfessions();
    }, []);

    // Submit registration
    const handleRegister = async (values: RegisterFormValues) => {
        try {
            setLoading(true);

            const response = await authService.register({
                name: values.name,
                email: values.email,
                password: values.password,
                countryId: values.countryId,
                professionId: values.professionId,
            });

            if (!response.success) {
                toast.error(response.message || "Registration failed.");
                return;
            }

            toast.success(response.message || "Registration successful!");

            navigate(APP_ROUTES.login);
        } catch (error: any) {
            console.error("Registration error:", error);

            toast.error(
                error?.response?.data?.message ||
                "Registration failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-lg rounded-xl border-0 shadow-lg">
                {/* Header */}
                <div className="mb-6 text-center">
                    <Title level={3} className="!mb-1">
                        Create an Account
                    </Title>

                    <Text type="secondary">
                        Fill in your details to register as a student.
                    </Text>
                </div>

                <Form<RegisterFormValues>
                    layout="vertical"
                    size="large"
                    autoComplete="off"
                    onFinish={handleRegister}
                >
                    {/* Full Name */}
                    <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your full name.",
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Enter your name"
                        />
                    </Form.Item>

                    {/* Email */}
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
                                message:
                                    "Please enter a valid email address.",
                            },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Enter your email"
                        />
                    </Form.Item>

                    {/* Country */}
                    <Form.Item
                        name="countryId"
                        label="Country"
                        rules={[
                            {
                                required: true,
                                message: "Please select your country.",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select your country"
                            loading={loadingCountries}
                            disabled={loadingCountries}
                            showSearch
                            optionFilterProp="label"
                            suffixIcon={<GlobalOutlined />}
                            options={countries.map((country) => ({
                                value: country.id,
                                label: (
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <ReactCountryFlag
                                            countryCode={country.code.toUpperCase()}
                                            svg
                                            style={{
                                                width: "20px",
                                                height: "15px",
                                                marginRight: "8px",
                                                flexShrink: 0,
                                            }}
                                        />

                                        <span>{country.name}</span>
                                    </div>
                                ),
                            }))}
                        />
                    </Form.Item>

                    {/* Profession */}
                    <Form.Item
                        name="professionId"
                        label="Profession"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please select your profession.",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select your profession"
                            loading={loadingProfessions}
                            disabled={loadingProfessions}
                            showSearch
                            optionFilterProp="label"
                            suffixIcon={<IdcardOutlined />}
                            options={professions.map((profession) => ({
                                value: profession.id,
                                label: profession.title,
                            }))}
                        />
                    </Form.Item>

                    {/* Password */}
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please enter a password.",
                            },
                            {
                                min: 6,
                                message:
                                    "Password must be at least 6 characters.",
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Enter your password"
                        />
                    </Form.Item>

                    {/* Confirm Password */}
                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={["password"]}
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please confirm your password.",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        value ===
                                        getFieldValue("password")
                                    ) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject(
                                        new Error(
                                            "Passwords do not match."
                                        )
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Confirm your password"
                        />
                    </Form.Item>

                    {/* Register Button */}
                    <Form.Item className="!mb-2 !mt-6">
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            disabled={
                                loadingCountries ||
                                loadingProfessions
                            }
                            className="h-11"
                        >
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>

                {/* Login */}
                <div className="mt-4 text-center">
                    <Text type="secondary">
                        Already have an account?{" "}
                    </Text>

                    <Link
                        to={APP_ROUTES.login}
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Log in here
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default RegisterPage;