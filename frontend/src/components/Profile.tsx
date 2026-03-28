import { useEffect, useState } from "react";
import { NavLink, useNavigate, Navigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { AiOutlineLogout } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";
import axios from "axios";

const Profile = () => {
    const { user: contextUser, logout } = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState(contextUser); // local state for fresh data
    const [showConfirmPanel, setShowConfirmPanel] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500)
        return () => clearTimeout(timer);
    }, [])
    // Redirect if no user
    if (!contextUser) return <Navigate to="/login" replace />;

    // Fetch latest profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_PROFILE_KEY}?userId=${contextUser._id}`,
                    {
                        withCredentials: true
                    }
                );
                setUser(response.data.user); // populate local state with latest backend data
            } catch (err) {
                setError("Something went wrong");
            }
        };

        fetchProfile();
    }, [contextUser]);

    const confirmLogout = () => {
        logout(); // remove token & user from context & localStorage
        setShowConfirmPanel(false);
        navigate("/login", { replace: true });
    };

    const cancelLogout = () => setShowConfirmPanel(false);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600">
                {error}
            </div>
        );
    }

    if (!user) return <Loader />;

    return (
        <>
            {loading && <Loader />}

            {/* Background with gradient */}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-50 px-4 py-8 md:px-8 flex items-center justify-center">

                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">

                    {/* LEFT COLUMN */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-200/60 transition-all duration-300">
                        <div className="flex flex-col items-center text-center">

                            {/* Avatar */}
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform duration-300">
                                {user.username.charAt(0).toUpperCase()}
                            </div>

                            <h2 className="mt-5 text-xl font-bold text-gray-900">
                                {user.fullname || "No name added"}
                            </h2>

                            <p className="text-sm text-gray-500">@{user.username}</p>

                            {/* Status */}
                            <div
                                className={`mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold
                                ${user.isProfileCompleted
                                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30"
                                        : "bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/30"
                                    }`}
                            >
                                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                                {user.isProfileCompleted ? "Profile Completed" : "Profile Incomplete"}
                            </div>
                        </div>

                        <div className="my-6 border-t border-gray-200" />

                        {/* Meta */}
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                                <span className="text-gray-500">Role</span>
                                <span className="font-semibold text-gray-900 capitalize">{user.role}</span>
                            </div>

                            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                                <span className="text-gray-500">Gender</span>
                                <span className="font-semibold text-gray-900 capitalize">{user.gender || "—"}</span>
                            </div>

                            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                                <span className="text-gray-500">Domain</span>
                                <span className="font-semibold text-gray-900">{user.domain || "—"}</span>
                            </div>

                            <div>
                                <NavLink
                                    to="/profilecompleted"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <CiEdit className="w-5 h-5" />
                                    Edit Profile
                                </NavLink>
                            </div>

                            <div>
                                <button
                                    onClick={() => setShowConfirmPanel(true)}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold text-sm hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <AiOutlineLogout className="w-5 h-5" />
                                    LogOut
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-200/60 transition-all duration-300">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                            Profile Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                                <p className="text-gray-500 mb-1 text-xs uppercase tracking-wide">Email</p>
                                <p className="font-semibold text-gray-900 break-all">{user.email}</p>
                            </div>

                            <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                                <p className="text-gray-500 mb-1 text-xs uppercase tracking-wide">Phone</p>
                                <p className="font-semibold text-gray-900">{user.phone ? "+" + user.phone : "Not provided"}</p>
                            </div>

                            <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                                <p className="text-gray-500 mb-1 text-xs uppercase tracking-wide">Location</p>
                                <p className="font-semibold text-gray-900">{user.location || "Not provided"}</p>
                            </div>

                            <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                                <p className="text-gray-500 mb-1 text-xs uppercase tracking-wide">Domain</p>
                                <p className="font-semibold text-gray-900">{user.domain || "Not selected"}</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-gray-500 text-sm mb-2 uppercase tracking-wide">Bio</p>
                            <p className="text-gray-800 leading-relaxed break-words break-all whitespace-pre-wrap">{user.bio || "No bio added yet."}</p>
                        </div>
                    </div>
                </div>

                {/* Confirmation Panel */}
                {showConfirmPanel && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 text-center transform transition-all duration-300 scale-100 animate-fade-in">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                                <AiOutlineLogout className="w-8 h-8 text-red-600" />
                            </div>
                            <h2 className="text-lg font-bold mb-2 text-gray-900">
                                Are you sure?
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">
                                You will be logged out of your account.
                            </p>
                            <div className="flex justify-around gap-3">
                                <button
                                    onClick={confirmLogout}
                                    className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    Yes, Logout
                                </button>
                                <button
                                    onClick={cancelLogout}
                                    className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Profile;