import logo1 from "../images/logo1.png";
import { FcGoogle } from "react-icons/fc";
import registerimage from "../images/registerimage.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const { register, error, success } = useAuth();
    const navigate = useNavigate();

    const [FormData, SetFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    // change input values
    const HandleChange = (e: any) => {
        SetFormData({ ...FormData, [e.target.name]: e.target.value });
    }

    // Submit Register data function
    const HandleSubmit = async (e: any) => {
        e.preventDefault();
        await register(FormData);
        const timer = setTimeout(() => {
            navigate("/login");
            return clearTimeout(timer);
        }, 3000)
    }

    return (
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
                        <h1 className="text-1xl sm:text-2xl font-extrabold text-gray-900">
                            Register First Than Explore
                        </h1>

                        {/* Social Buttons */}
                        <div className="mt-8 space-y-4">
                            <a
                                href="#"
                                className="flex items-center justify-center w-full max-w-xs mx-auto py-3 px-4 border rounded-lg bg-gray-100 hover:bg-gray-200 transition text-sm font-semibold"
                            >
                                <span>
                                    <FcGoogle className="w-5 h-5" />
                                </span>
                                <span className="ml-4">Sign Up with Google</span>
                            </a>
                        </div>

                        {/* Divider */}
                        <div className="my-10 flex items-center">
                            <div className="flex-grow border-t" />
                            <span className="mx-4 text-sm text-gray-500">
                                Or sign up with email
                            </span>
                            <div className="flex-grow border-t" />
                        </div>

                        {/* Form */}
                        <form className="max-w-xs mx-auto space-y-4" onSubmit={HandleSubmit}>
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-full px-4 py-2 rounded-md bg-gray-100 border focus:outline-none focus:border-gray-400"
                                value={FormData.username}
                                onChange={HandleChange}
                                name="username"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full px-4 py-2 rounded-md bg-gray-100 border focus:outline-none focus:border-gray-400"
                                value={FormData.email}
                                onChange={HandleChange}
                                name="email"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-2 rounded-md bg-gray-100 border focus:outline-none focus:border-gray-400"
                                value={FormData.password}
                                onChange={HandleChange}
                                name="password"
                            />

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
                                className="w-full py-3 bg-[#004fcb] text-white font-medium border hover:bg-[#002970] hover:cursor-pointer transition duration-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
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
                <div className="hidden lg:flex w-1/2 bg-purple-100 items-center justify-center">
                    <img
                        src={registerimage}
                        alt="Illustration"
                        className="h-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default Register;