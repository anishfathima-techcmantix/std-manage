export const API_ENDPOINTS = {
    auth: {
        login: "/auth/login",
        register: "/auth/register",
        me: "/auth/me",
    },
    countries: {
        list: "/countries",
    },
    professions: {
        list: "/professions",
    }
} as const;