import React, { createContext, useContext, useState, useEffect } from "react";

// User information stored after login.
export interface AuthUser {
    userId: string;
    email: string;
    role: "ADMIN" | "STUDENT";
}

interface AuthContextType {
    currentUser: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string, user: AuthUser) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provides authentication data to the entire application.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Load the saved user session when the app starts.
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("currentUser");

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setCurrentUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse stored user profile", error);
                localStorage.removeItem("token");
                localStorage.removeItem("currentUser");
            }
        }
        setIsLoading(false);
    }, []);

    // Save the user details after a successful login.
    const login = (newToken: string, userProfile: AuthUser) => {
        setToken(newToken);
        setCurrentUser(userProfile);
        localStorage.setItem("token", newToken);
        localStorage.setItem("currentUser", JSON.stringify(userProfile));
    };

    // Remove the user session and go to the login page.
    const logout = () => {
        setToken(null);
        setCurrentUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                token,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Hook to access authentication data in any component.
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};