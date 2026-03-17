import { useEffect, useState } from "react";
import { NavLink, Navigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { FiMail, FiPhone, FiMapPin, FiBriefcase, FiUser, FiTag } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const EmployerAccount = () => {
    const { user: contextUser } = useAuth();
    const [user, setUser] = useState(contextUser);
    const [error, setError] = useState<string | null>(null);

    if (!contextUser) return <Navigate to="/login" replace />;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_PROFILE_KEY}?userId=${contextUser._id}`,
                    { credentials: "include" }
                );
                const data = await response.json();
                if (!response.ok) {
                    setError(data.message || "Failed to fetch profile");
                    return;
                }
                setUser(data.user);
            } catch (err) {
                setError("Something went wrong");
            }
        };
        fetchProfile();
    }, [contextUser]);

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="px-6 py-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    {error}
                </div>
            </div>
        );
    }

    if (!user) return <Loader />;

    return (
        <div className="min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8 md:px-8">

            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT COLUMN */}
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 sm:p-8 hover:border-slate-600/50 transition-colors duration-300">
                        <div className="flex flex-col items-center text-center">

                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform duration-300">
                                {user.username.charAt(0).toUpperCase()}
                            </div>

                            <h2 className="mt-5 text-xl font-bold text-white">
                                {user.fullname || "No name added"}
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">@{user.username}</p>

                            {/* Status Badge */}
                            <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold
                                ${user.isProfileCompleted
                                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                }`}
                            >
                                <span className={`w-2 h-2 rounded-full animate-pulse ${user.isProfileCompleted ? "bg-green-400" : "bg-amber-400"}`} />
                                {user.isProfileCompleted ? "Profile Completed" : "Profile Incomplete"}
                            </div>
                        </div>

                        <div className="my-6 border-t border-slate-700/50" />

                        {/* Meta Info */}
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors duration-200">
                                <span className="text-slate-400 flex items-center gap-2">
                                    <FiBriefcase size={14} /> Role
                                </span>
                                <span className="font-semibold text-white capitalize">{user.role}</span>
                            </div>

                            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors duration-200">
                                <span className="text-slate-400 flex items-center gap-2">
                                    <FiUser size={14} /> Gender
                                </span>
                                <span className="font-semibold text-white capitalize">{user.gender || "—"}</span>
                            </div>

                            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors duration-200">
                                <span className="text-slate-400 flex items-center gap-2">
                                    <FiTag size={14} /> Domain
                                </span>
                                <span className="font-semibold text-white">{user.domain || "—"}</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <NavLink
                                to="/profilecompleted"
                                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <CiEdit className="w-5 h-5" />
                                Edit Profile
                            </NavLink>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Profile Information */}
                        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 sm:p-8 hover:border-slate-600/50 transition-colors duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
                                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Profile Information</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoCard
                                    icon={<FiMail size={15} className="text-blue-400" />}
                                    label="Email"
                                    value={user.email}
                                />
                                <InfoCard
                                    icon={<FiPhone size={15} className="text-green-400" />}
                                    label="Phone"
                                    value={user.phone ? `+${user.phone}` : "Not provided"}
                                />
                                <InfoCard
                                    icon={<FiMapPin size={15} className="text-purple-400" />}
                                    label="Location"
                                    value={user.location || "Not provided"}
                                />
                                <InfoCard
                                    icon={<FiTag size={15} className="text-amber-400" />}
                                    label="Domain"
                                    value={user.domain || "Not selected"}
                                />
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 sm:p-8 hover:border-slate-600/50 transition-colors duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
                                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Bio</h3>
                            </div>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">
                                {user.bio || "No bio added yet."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Helper ───────────────────────────────────────────────

const InfoCard = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode
    label: string
    value: string
}) => (
    <div className="p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors duration-200">
        <div className="flex items-center gap-2 mb-1.5">
            {icon}
            <p className="text-slate-400 text-xs uppercase tracking-wide font-medium">{label}</p>
        </div>
        <p className="font-semibold text-white text-sm break-all">{value}</p>
    </div>
)

export default EmployerAccount;