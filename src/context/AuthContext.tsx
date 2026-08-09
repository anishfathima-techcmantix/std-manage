import { User } from "../types/auth.types";
import { authService } from "../services/auth.service";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
    currentUser: User | null;
    token: string | null;
    isLoading: boolean;
    login: (accessToken: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("accessToken")
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem("accessToken");

            if (storedToken) {
                try {
                    const response = await authService.getMe();
                    if (response.currentUser) {
                        setCurrentUser(response.currentUser);
                    }
                } catch (error) {
                    logout();
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const login = (accessToken: string, user: User) => {
        localStorage.setItem("accessToken", accessToken);
        setToken(accessToken);
        setCurrentUser(user);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        setToken(null);
        setCurrentUser(null);
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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};