import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { API_Instance } from "@/api/axios.instance";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { APP_ROUTES } from "@/constants/appRoutes.constants";
import { Form, Input, Select, Button, Card, Typography } from "antd";
import { Country, Profession, RegisterFormValues } from "@/types/auth.types";
import { UserOutlined, MailOutlined, LockOutlined, GlobalOutlined, IdcardOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

export const RegisterPage: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [countries, setCountries] = useState<Country[]>([]);
    const [professions, setProfessions] = useState<Profession[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [fetchingLookups, setFetchingLookups] = useState<boolean>(true);

    // Direct API Calls inside Register Page
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [countryRes, professionRes] = await Promise.all([
                    API_Instance.get("/countries"),
                    API_Instance.get("/professions"),
                ]);

                setCountries(countryRes.data.data || []);
                setProfessions(professionRes.data.data || []);
            } catch (error: any) {
                toast.error("Failed to load country & profession list!");
            } finally {
                setFetchingLookups(false);
            }
        };

        fetchDropdownData();
    }, []);

    // Submit Handler
    const handleRegisterSubmit = async (values: RegisterFormValues) => {
        setLoading(true);

        try {
            const response = await authService.register({
                name: values.name,
                email: values.email,
                password: values.password,
                countryId: values.countryId,
                professionId: values.professionId,
            });

            if (response.success) {
                toast.success(response.message || "Registration successful!");
                navigate(APP_ROUTES.login || "/login");
            } else {
                toast.error(response.message || "Registration failed!");
            }
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Registration failed!"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-lg rounded-xl border-0 shadow-lg">
                <div className="mb-6 text-center">
                    <Title level={3} className="!mb-1">
                        Create an Account
                    </Title>
                    <Text type="secondary">
                        Fill in your details to register as a student.
                    </Text>
                </div>

                <Form<RegisterFormValues>
                    form={form}
                    layout="vertical"
                    onFinish={handleRegisterSubmit}
                    autoComplete="off"
                    size="large"
                >
                    {/* Full Name */}
                    <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[{ required: true, message: "Please enter your full name." }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Anis Ahamad" />
                    </Form.Item>

                    {/* Email */}
                    <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                            { required: true, message: "Please enter your email." },
                            { type: "email", message: "Please enter a valid email address." },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="anis@example.com" />
                    </Form.Item>

                    {/* Country Dropdown with Flag */}
                    <Form.Item
                        name="countryId"
                        label="Country"
                        rules={[{ required: true, message: "Please select your country." }]}
                    >
                        <Select
                            placeholder="Select your country"
                            loading={fetchingLookups}
                            showSearch
                            optionFilterProp="children"
                            suffixIcon={<GlobalOutlined />}
                        >
                            {countries.map((country) => (
                                <Option key={country.id} value={country.id}>
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={`https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`}
                                            alt={country.name}
                                            className="h-3.5 w-5 rounded-sm border border-gray-200 object-cover"
                                        />
                                        <span>{country.name}</span>
                                    </div>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Profession Dropdown */}
                    <Form.Item
                        name="professionId"
                        label="Profession"
                        rules={[{ required: true, message: "Please select your profession." }]}
                    >
                        <Select
                            placeholder="Select your profession"
                            loading={fetchingLookups}
                            suffixIcon={<IdcardOutlined />}
                        >
                            {professions.map((profession) => (
                                <Option key={profession.id} value={profession.id}>
                                    {profession.title}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Password */}
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: "Please enter a password." },
                            { min: 6, message: "Password must be at least 6 characters." },
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
                            { required: true, message: "Please confirm your password." },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error("The two passwords do not match!")
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
                            className="h-11"
                            style={{ backgroundColor: "#1677ff" }}
                        >
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>

                {/* Back to Login */}
                <div className="mt-4 text-center">
                    <Text type="secondary">Already have an account? </Text>
                    <Link
                        to={APP_ROUTES.login || "/login"}
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