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

    // Login function attempt
    const HandleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username || !formData.password) return;

        try {
            const loggedInuser = await login(formData);
            setTimeout(() => {
                if (!loggedInuser.isProfileCompleted) {
                    navigate("/profilecompleted");
                } else if (loggedInuser.role === "employer") {
                    navigate("/dashboard");
                } else {
                    navigate("/profile")
                }
            }, 2500)
        } catch (err: any) {
            console.error("error: ", err)
        }
    };

    return (
        <>
            {loading && <Loader />}
            <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
                <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg flex overflow-hidden">

                    {/* Left Section */}
                    <div className="w-full lg:w-1/2 p-6 sm:p-10">
                        {/* Logo */}
                        <div className="flex justify-center">
                            <img src={logo1} alt="Logo" className="w-[250px]" />
                        </div>

                        {/* Content */}
                        <div className="mt-10 text-center">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                Welcome Back
                            </h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Log in to continue to your account
                            </p>

                            {/* Form */}
                            <form className="max-w-xs mx-auto mt-8 space-y-4" onSubmit={HandleLogin}>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border focus:outline-none focus:border-gray-400"
                                    name="username"
                                    value={formData.username}
                                    onChange={HandleChange}
                                    minLength={7}
                                    maxLength={15}
                                />

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        className="w-full px-4 py-3 pr-10 rounded-lg bg-gray-100 border focus:outline-none focus:border-gray-400"
                                        name="password"
                                        value={formData.password}
                                        onChange={HandleChange}
                                        minLength={8}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(prev => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>


                                {/* error & success messages */}
                                {error &&
                                    <p className="text-red-600 text-sm">
                                        {error}
                                    </p>
                                }

                                {success &&
                                    <p className="text-green-600 text-sm">
                                        {success}
                                    </p>
                                }

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-indigo-600 text-white font-medium border hover:bg-indigo-700 hover:cursor-pointer transition duration-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                                >
                                    Login
                                </button>

                                <p className="text-sm text-gray-600 text-center mt-6">
                                    Don’t have an account?{" "}
                                    <NavLink to="/register" className="text-blue-700">
                                        Sign Up
                                    </NavLink>
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Right Illustration */}
                    <div className="w-full lg:w-1/2 flex justify-center">
                        <Lottie
                            animationData={sidelottie1}
                            loop={true}
                            className="w-full h-full"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;