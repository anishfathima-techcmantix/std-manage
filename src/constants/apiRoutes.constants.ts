export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        ME: "/auth/me",
    },
    STUDENTS: {
        BASE: "/students",
        BY_ID: (id: string) => `/students/${id}`,
    },
} as const;