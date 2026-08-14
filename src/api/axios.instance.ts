import axios from "axios";
import toast from "react-hot-toast";

// Axios instance used for all API requests.
export const API_Instance = axios.create({
  baseURL: "/api",
});

// Add the JWT token to every request if the user is logged in.
API_Instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
        config.headers.set('Authorization', 'Bearer ' + token);
    }
    return config;
});

// If the token is invalid or expired, log the user out and redirect to the login page.
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
