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
    const [user, setUser] = useState(contextUser);
    const [showConfirmPanel, setShowConfirmPanel] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500)
        return () => clearTimeout(timer);
    }, [])

    if (!contextUser) return <Navigate to="/login" replace />;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_PROFILE_KEY}?userId=${contextUser._id}`,
                    {
                        withCredentials: true
                    }
                );
                setUser(response.data.user);
            } catch (err) {
                setError("Something went wrong");
            }
        };
        fetchProfile();
    }, [contextUser]);

    const confirmLogout = () => {
        logout();
        setShowConfirmPanel(false);
        navigate("/login", { replace: true });
    };

    const cancelLogout = () => setShowConfirmPanel(false);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-400 text-xl font-semibold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {error}
            </div>
        );
    }

    if (!user) return <Loader />;

    return (
        <>
            {loading && <Loader />}

            {/* Background with gradient */}
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8 md:px-8 flex items-center justify-center">

                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 w-full">

                    {/* LEFT COLUMN - Profile Card */}
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-2xl shadow-slate-900/50 hover:shadow-slate-900/70 transition-all duration-300">
                        <div className="flex flex-col items-center text-center">

                            {/* Avatar */}
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform duration-300 border-4 border-slate-700/50">
                                {user.username.charAt(0).toUpperCase()}
                            </div>

                            <h2 className="mt-5 text-xl font-bold text-white">
                                {user.fullname || "No name added"}
                            </h2>

                            <p className="text-sm text-slate-400">@ {user.username}</p>

                            {/* Status */}
                            <div className={`mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold shadow-lg
                                ${user.isProfileCompleted
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/30"
                                    : "bg-gradient-to-r from-yellow-500 to-amber-500 shadow-yellow-500/30"
                                } text-white`}>
                                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                                {user.isProfileCompleted ? "Profile Completed" : "Profile Incomplete"}
                            </div>
                        </div>

                        <div className="my-6 border-t border-slate-700/50" />

                        {/* Meta */}
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between items-center p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 transition-all duration-200">
                                <span className="text-slate-400">Role</span>
                                <span className="font-semibold text-white capitalize">{user.role}</span>
                            </div>

                            <div className="flex justify-between items-center p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 transition-all duration-200">
                                <span className="text-slate-400">Gender</span>
                                <span className="font-semibold text-white capitalize">{user.gender || "—"}</span>
                            </div>

                            <div className="flex justify-between items-center p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 transition-all duration-200">
                                <span className="text-slate-400">Domain</span>
                                <span className="font-semibold text-white">{user.domain || "—"}</span>
                            </div>

                            <div>
                                <NavLink
                                    to="/profilecompleted"
                                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-300 border border-slate-700/50"
                                >
                                    <CiEdit className="w-5 h-5" />
                                    Edit Profile
                                </NavLink>
                            </div>

                            <div>
                                <button
                                    onClick={() => setShowConfirmPanel(true)}
                                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold text-sm hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-0.5 transition-all duration-300 border border-slate-700/50"
                                >
                                    <AiOutlineLogout className="w-5 h-5" />
                                    LogOut
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Profile Info */}
                    <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-2xl shadow-slate-900/50 hover:shadow-slate-900/70 transition-all duration-300">
                        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></span>
                            Profile Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="p-6 rounded-2xl bg-slate-700/30 hover:bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 transition-all duration-200 group hover:-translate-y-1">
                                <p className="text-slate-400 mb-2 text-xs uppercase tracking-wide font-semibold">Email</p>
                                <p className="font-bold text-white break-all group-hover:text-blue-400 transition-colors">{user.email}</p>
                            </div>

                            <div className="p-6 rounded-2xl bg-slate-700/30 hover:bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 transition-all duration-200 group hover:-translate-y-1">
                                <p className="text-slate-400 mb-2 text-xs uppercase tracking-wide font-semibold">Phone</p>
                                <p className="font-bold text-white">{user.phone ? "+" + user.phone : "Not provided"}</p>
                            </div>

                            <div className="p-6 rounded-2xl bg-slate-700/30 hover:bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 transition-all duration-200 group hover:-translate-y-1">
                                <p className="text-slate-400 mb-2 text-xs uppercase tracking-wide font-semibold">Location</p>
                                <p className="font-bold text-white">{user.location || "Not provided"}</p>
                            </div>

                            <div className="p-6 rounded-2xl bg-slate-700/30 hover:bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 transition-all duration-200 group hover:-translate-y-1">
                                <p className="text-slate-400 mb-2 text-xs uppercase tracking-wide font-semibold">Domain</p>
                                <p className="font-bold text-white">{user.domain || "Not selected"}</p>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-700/50">
                            <p className="text-slate-400 text-sm mb-4 uppercase tracking-wide font-semibold">Bio</p>
                            <p className="text-slate-200 leading-relaxed break-words break-all whitespace-pre-wrap text-lg">{user.bio || "No bio added yet. Add a professional summary to showcase your skills and experience."}</p>
                        </div>
                    </div>
                </div>

                {/* Confirmation Panel */}
                {showConfirmPanel && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md">
                        <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8 w-96 text-center transform transition-all duration-300 scale-100">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/20 border-2 border-red-500/30 flex items-center justify-center">
                                <AiOutlineLogout className="w-10 h-10 text-red-400" />
                            </div>
                            <h2 className="text-2xl font-bold mb-3 text-white">
                                Are you sure?
                            </h2>
                            <p className="text-slate-400 mb-8 text-lg leading-relaxed">
                                You will be logged out of your account.
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={confirmLogout}
                                    className="px-8 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold shadow-lg shadow-red-500/30 hover:from-red-700 hover:to-rose-700 hover:shadow-red-500/50 hover:-translate-y-0.5 transition-all duration-300 border border-slate-700/50"
                                >
                                    Yes, Logout
                                </button>
                                <button
                                    onClick={cancelLogout}
                                    className="px-8 py-3 bg-slate-700/50 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 border border-slate-600/50 hover:text-white transition-all duration-300"
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