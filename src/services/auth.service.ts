import { API_Instance } from "../api/axios.instance";
import { API_ENDPOINTS } from "../constants/apiRoutes.constants";
import { AuthResponse, LoginCredentials, RegisterPayload } from "../types/auth.types";

export const authService = {
    // Login User
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await API_Instance.post<AuthResponse>(
            API_ENDPOINTS.auth.login,
            credentials
        );
        return response.data;
    },

    // Register User
    register: async (payload: RegisterPayload): Promise<AuthResponse> => {
        const response = await API_Instance.post<AuthResponse>(
            API_ENDPOINTS.auth.register,
            payload
        );
        return response.data;
    },

    // Get Current Authenticated User Profile
    getMe: async (): Promise<AuthResponse> => {
        const response = await API_Instance.get<AuthResponse>(
            API_ENDPOINTS.auth.me
        );
        return response.data;
    },
};