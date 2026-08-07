export type UserRole = "ADMIN" | "STUDENT";

export interface User {
    id: string;
    email: string;
    role: UserRole;
    createdAt?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    role?: UserRole;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        accessToken: string;
        authenticatedUser: User;
    };
    currentUser?: User;
}