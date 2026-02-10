import { useEffect, useState } from "react";
import { NavLink, useNavigate, Navigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { AiOutlineLogout } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

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
                const response = await fetch(
                    `${import.meta.env.VITE_PROFILE_KEY}?userId=${contextUser._id}`
                );
                const data = await response.json();
                if (!response.ok) {
                    setError(data.message || "Failed to fetch profile");
                    return;
                }
                setUser(data.user); // populate local state with latest backend data
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

            <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 flex items-center justify-center">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
                        <div className="flex flex-col items-center text-center">

                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-full bg-gray-900 text-white flex items-center justify-center text-3xl font-semibold">
                                {user.username.charAt(0).toUpperCase()}
                            </div>

                            <h2 className="mt-4 text-lg font-semibold text-gray-900">
                                {user.fullname || "No name added"}
                            </h2>

                            <p className="text-sm text-gray-500">@{user.username}</p>

                            {/* Status */}
                            <div
                                className={`mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
                                ${user.isProfileCompleted
                                        ? "bg-green-50 text-green-700 border border-green-200"
                                        : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                    }`}
                            >
                                <span className="w-2 h-2 rounded-full bg-current" />
                                {user.isProfileCompleted ? "Profile Completed" : "Profile Incomplete"}
                            </div>
                        </div>

                        <div className="my-6 border-t border-gray-200" />

                        {/* Meta */}
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Role</span>
                                <span className="font-medium text-gray-900 capitalize">{user.role}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Gender</span>
                                <span className="font-medium text-gray-900 capitalize">{user.gender || "—"}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Domain</span>
                                <span className="font-medium text-gray-900">{user.domain || "—"}</span>
                            </div>

                            <div>
                                <NavLink
                                    to="/profilecompleted"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 shadow-md transition-colors duration-200"
                                >
                                    <CiEdit className="w-5 h-5" />
                                    Edit Profile
                                </NavLink>
                            </div>

                            <div>
                                <button
                                    onClick={() => setShowConfirmPanel(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 shadow-md transition-colors duration-200 hover:cursor-pointer"
                                >
                                    <AiOutlineLogout className="w-5 h-5" />
                                    LogOut
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 md:p-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div>
                                <p className="text-gray-500 mb-1">Email</p>
                                <p className="font-medium text-gray-900 break-all">{user.email}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 mb-1">Phone</p>
                                <p className="font-medium text-gray-900">{user.phone ? "+" + user.phone : "Not provided"}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 mb-1">Location</p>
                                <p className="font-medium text-gray-900">{user.location || "Not provided"}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 mb-1">Domain</p>
                                <p className="font-medium text-gray-900">{user.domain || "Not selected"}</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-gray-500 text-sm mb-2">Bio</p>
                            <p className="text-gray-800 leading-relaxed break-words break-all whitespace-pre-wrap">{user.bio || "No bio added yet."}</p>
                        </div>
                    </div>
                </div>

                {/* Confirmation Panel */}
                {showConfirmPanel && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
                            <h2 className="text-lg font-semibold mb-4">
                                Are you sure you want to logout?
                            </h2>
                            <div className="flex justify-around mt-4">
                                <button
                                    onClick={confirmLogout}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition hover:cursor-pointer"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={cancelLogout}
                                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition hover:cursor-pointer"
                                >
                                    No
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