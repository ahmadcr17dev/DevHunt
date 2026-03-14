import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// ---- Types ----
interface User {
    _id: string;
    username: string;
    fullname: string;
    email: string;
    isProfileCompleted: boolean;
    role: "jobseeker" | "employer" | "both";
    phone: string;
    gender: "male" | "female" | "custom";
    location: string;
    domain: string;
    bio: string;
}

interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    register: (data: RegisterData) => Promise<boolean>;
    login: (data: LoginData) => Promise<User>;
    error: string | null;
    success: string | null;
    logout: () => void;
    ClearMessage: () => void;
    loadingUser: boolean;
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

// ---- Context ----
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---- Provider ----
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(
                    import.meta.env.VITE_PROFILE_KEY as string,
                    { withCredentials: true }
                );
                setUser(res.data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoadingUser(false);
            }
        };
        fetchUser();
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
            return response.data;
        } catch (err: any) {
            const message = err.response?.data?.message;
            setError(message);
            setSuccess(null);
            throw err; // 👈 CRITICAL
        }
    };

    // login function
    const login = async ({ username, password }: LoginData): Promise<User> => {
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post(
                import.meta.env.VITE_LOGIN_KEY as string,
                { username, password },
                { withCredentials: true }
            );
            setSuccess(response.data.message);
            setUser(response.data.user);
            return response.data.user;
        } catch (err: any) {
            const message = err.response?.data?.message;
            setError(message);
            setSuccess(null);
            throw err;
        }
    };

    // logout fuction
    const logout = async () => {
        try {
            await axios.post(import.meta.env.VITE_LOGOUT_KEY as string,
                {},
                {
                    withCredentials: true
                });
        } catch (error) {
            console.error("Logout failed: ", error);
        }
    };

    // clear message on page load
    const ClearMessage = () => {
        setSuccess(null);
        setError(null);
    }

    return (
        <AuthContext.Provider value={{ user, setUser, register, error, logout, success, login, ClearMessage, loadingUser }}>
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