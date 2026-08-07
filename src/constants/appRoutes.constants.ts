export const APP_ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    DASHBOARD: "/dashboard",
    STUDENTS: "/students",
    STUDENT_DETAILS: (id: string) => `/students/${id}`,
    PROFILE: "/profile",
    UNAUTHORIZED: "/unauthorized",
    NOT_FOUND: "*",
} as const;