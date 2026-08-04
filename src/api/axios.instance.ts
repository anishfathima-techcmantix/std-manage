import axios from "axios";
import toast from "react-hot-toast";

// Centralized Axios instance with base URL for Express backend APIs.
export const API_Instance = axios.create({
    baseURL: "/api",
});

// Automatically attaches JWT Token from localStorage to request Authorization header.
API_Instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handles 401 Unauthorized errors by showing toast, clearing storage, and redirecting to login.
API_Instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            toast.error("Your session has expired. Please log in again.");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("currentUser");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);