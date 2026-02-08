import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";

// ---- Types ----
interface User {
    _id: string;
    username: string;
    email: string;
    isProfileCompleted: boolean;
    role: string
    // add more fields if needed
}

interface AuthContextType {
    user: User | null;
    register: (data: RegisterData) => Promise<boolean>;
    login: (data: LoginData) => Promise<User | null>;
    error: string | null;
    success: string | null;
    logout: () => void;
    ClearMessage: () => void;
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
}

interface LoginData {
    username: string,
    password: string
}

interface AuthProviderProps {
    children: ReactNode;
}

// ---- Context ----
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---- Provider ----
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!storedUser || storedUser === "undefined" || !token) {
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } catch (err) {
            console.error("Failed to parse stored user:", err);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }

    }, []);

    // Register function
    const register = async ({ username, email, password }: RegisterData) => {
        setError(null);
        setSuccess(null);
        try {
            const response = await axios.post(import.meta.env.VITE_REGISTER_KEY as string, {
                username,
                email,
                password,
            });

            setSuccess(response.data.message);
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message);
            return false;
        }
    };

    // login function
    const login = async ({ username, password }: LoginData) => {
        setError(null);
        setSuccess(null);
        try {
            const response = await axios.post(import.meta.env.VITE_LOGIN_KEY as string, {
                username, password
            });

            const { token, user } = response.data;

            // save to local storage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            // set auth header
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            setSuccess(response.data.message);
            setUser(user);
            return user;
        } catch (err: any) {
            setError(err.response?.data?.message);
            return null;
        }
    }

    // logout fuction
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
    };

    // clear message on page load
    const ClearMessage = () => {
        setSuccess(null);
        setError(null);
    }

    return (
        <AuthContext.Provider value={{ user, register, error, logout, success, login, ClearMessage }}>
            {children}
        </AuthContext.Provider>
    );
};

// ---- Hook ----
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};