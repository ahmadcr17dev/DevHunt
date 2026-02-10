import logo1 from "../images/logo1.png";
import { NavLink, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";
import Lottie from "lottie-react";
import sidelottie from "../images/sidelottie.json";
import { FiEye, FiEyeOff } from 'react-icons/fi'

const Register = () => {
    const { register, error, success, ClearMessage } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [FormData, SetFormData] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    // clear any message
    useEffect(() => {
        ClearMessage();
    }, [])

    // show loader on page loads
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500)
        return () => clearTimeout(timer);
    }, [])

    // change input values
    const HandleChange = (e: any) => {
        SetFormData({ ...FormData, [e.target.name]: e.target.value });
    }

    // Submit Register data function
    const HandleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await register(FormData);

        setTimeout(() => {
            navigate("/login");
        }, 2500);
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
                        <div className="my-6 text-center">
                            <h1 className="text-1xl sm:text-2xl font-extrabold text-gray-900 my-6">
                                Register First Than Explore
                            </h1>

                            {/* Form */}
                            <form className="max-w-xs mx-auto space-y-4" onSubmit={HandleSubmit}>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="w-full px-4 py-2 rounded-md bg-gray-100 border focus:outline-none focus:border-gray-400"
                                    value={FormData.username}
                                    onChange={HandleChange}
                                    name="username"
                                    minLength={7}
                                    maxLength={15}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full px-4 py-2 rounded-md bg-gray-100 border focus:outline-none focus:border-gray-400"
                                    value={FormData.email}
                                    onChange={HandleChange}
                                    name="email"
                                />
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        className="w-full px-4 py-2 pr-10 rounded-md bg-gray-100 border focus:outline-none focus:border-gray-400"
                                        value={FormData.password}
                                        onChange={HandleChange}
                                        name="password"
                                        minLength={8}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(prev => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                                    Sign Up
                                </button>

                                <p className="text-sm text-gray-600 text-center mt-6">
                                    Already have an account?{" "}
                                    <NavLink to="/login" className="text-blue-700">
                                        Sign In
                                    </NavLink>
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Right Illustration */}
                    <div className="w-full lg:w-1/2 flex justify-center">
                        <Lottie
                            animationData={sidelottie}
                            loop={true}
                            className="w-full h-full"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;