import logo1 from "../images/logo1.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import sidelottie1 from "../images/sidelottie1.json";
import Loader from "./Loader";
import { FiEye, FiEyeOff } from 'react-icons/fi'

const Login = () => {
    const navigate = useNavigate();
    const { login, error, success, ClearMessage } = useAuth();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        ClearMessage();
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500)
        return () => clearTimeout(timer);
    }, []);

    const HandleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const HandleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username || !formData.password) return;

        try {
            const loggedInuser = await login(formData);
            setTimeout(() => {
                if (!loggedInuser.isProfileCompleted) {
                    navigate("/profilecompleted");
                } else if (loggedInuser.role === "employer") {
                    navigate("/employer");
                } else {
                    navigate("/jobspage")
                }
            }, 2500)
        } catch (err: any) {
            console.error("error: ", err)
        }
    };

    return (
        <>
            {loading && <Loader />}

            {/* Background with gradient */}
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">

                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                </div>

                {/* Main Card */}
                <div className="w-full max-w-5xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl flex overflow-hidden relative z-10">

                    {/* Left Section - Form */}
                    <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-12">
                        {/* Logo */}
                        <div className="flex justify-center mb-8">
                            <img
                                src={logo1}
                                alt="Logo"
                                className="w-[250px] transition-all duration-300 hover:scale-105"
                            />
                        </div>

                        {/* Content */}
                        <div className="mt-6 text-center">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
                                Welcome Back
                            </h1>
                            <p className="text-base text-slate-400">
                                Log in to continue to your account
                            </p>

                            {/* Form */}
                            <form className="max-w-sm mx-auto mt-10 space-y-5" onSubmit={HandleLogin}>
                                {/* Username Input */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-300 text-left">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your username"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                                        name="username"
                                        value={formData.username}
                                        onChange={HandleChange}
                                        minLength={7}
                                        maxLength={15}
                                    />
                                </div>

                                {/* Password Input */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-300 text-left">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                                            name="password"
                                            value={formData.password}
                                            onChange={HandleChange}
                                            minLength={8}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(prev => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none transition-colors duration-200"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Error & Success Messages */}
                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                        <p className="text-red-400 text-sm font-medium">
                                            {error}
                                        </p>
                                    </div>
                                )}

                                {success && (
                                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                                        <p className="text-green-400 text-sm font-medium">
                                            {success}
                                        </p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 hover:cursor-pointer"
                                >
                                    <span>Login</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </button>

                                {/* Sign Up Link */}
                                <p className="text-sm text-slate-400 text-center mt-6">
                                    Don't have an account?{" "}
                                    <NavLink
                                        to="/register"
                                        className="text-blue-400 font-semibold hover:text-blue-300 hover:underline transition-colors duration-200"
                                    >
                                        Sign Up
                                    </NavLink>
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Right Illustration */}
                    <div className="hidden lg:flex w-1/2 bg-slate-800/30 border-l border-slate-700/50 items-center justify-center p-8">
                        <div className="w-full h-full max-w-md">
                            <Lottie
                                animationData={sidelottie1}
                                loop={true}
                                className="w-full h-full filter"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;