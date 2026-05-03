import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// ---- Types ----
interface User {
    _id: string;
    username: string;
    fullname: string;
    email: string;
    isProfileCompleted: boolean;
    role: "jobseeker" | "employer";
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
    savedJobs: string[],
    saveJob: (jobId: string) => Promise<void>;
    unsaveJob: (jobId: string) => Promise<void>;
    getSavedJobCount: (jobId: string) => Promise<number>;
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
    const [savedJobs, setSavedJobs] = useState<string[]>([]);

    useEffect(() => {
        const fetchUser = async () => {
            console.log('🔍 AuthContext: Starting fetchUser...');
            console.log('🔍 VITE_PROFILE_KEY:', import.meta.env.VITE_PROFILE_KEY);
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

    // save job functionality
    const saveJob = async (jobId: string) => {
        try {
            await axios.post(`${import.meta.env.VITE_SAVE_JOB}/${jobId}` as string,
                {},
                {
                    withCredentials: true
                }
            );
            setSavedJobs(prev => [...prev, jobId]);
        } catch (error) {
            console.error('Failed to save job');
        }
    }

    // un save a job
    const unsaveJob = async (jobId: string) => {
        try {
            await axios.delete(`${import.meta.env.VITE_UNSAVE_JOB}/${jobId}` as string,
                {
                    withCredentials: true
                });
            setSavedJobs(prev => prev.filter(id => id !== jobId));
        } catch (error) {
            console.error('Failed to unsave job');
        }
    }

    // load saved jobs on login
    useEffect(() => {
        if (user) {
            loadSavedJobs();
        }
    }, [user]);

    const loadSavedJobs = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_GET_JOB_COUNT}` as string,
                {
                    withCredentials: true
                }
            );
            setSavedJobs(response.data.savedJobs.map((sj: any) => sj.job._id));
        } catch (error) {
            console.error('Failed to load job counts');
        }
    }

    // clear message on page load
    const ClearMessage = () => {
        setSuccess(null);
        setError(null);
    }

    return (
        <AuthContext.Provider value={
            {
                user, setUser, register, error, logout, success, login, ClearMessage, loadingUser, saveJob, savedJobs, unsaveJob,
                getSavedJobCount: () => axios.get(`${import.meta.env.VITE_GET_JOB_COUNT}`, {
                    withCredentials: true
                }).then(res => res.data.count)
            }
        }>
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