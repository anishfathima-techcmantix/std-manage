// Auth Types

export type UserRole = "ADMIN" | "STUDENT";

export interface Country {
    id: string;
    name: string;
    code: string;
}

export interface Profession {
    id: string;
    title: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    countryId: string;
    professionId: string;
    country?: Country;
    profession?: Profession;
    createdAt?: string;
    updatedAt?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    countryId: string;
    professionId: string;
    role?: UserRole;
}

export interface RegisterFormValues extends RegisterPayload {
    confirmPassword?: string;
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