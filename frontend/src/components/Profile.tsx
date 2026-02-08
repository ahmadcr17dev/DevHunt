import { useEffect, useState } from "react";

interface User {
    _id: string;
    username: string;
    email: string;
    role: "jobseeker" | "employer";
    fullname?: string;
    phone?: string;
    gender?: "male" | "female" | "custom";
    location?: string;
    bio?: string;
    domain?: string;
    isProfileCompleted: boolean;
}

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (!storedUser) {
                    setError("User not found. Please login again.");
                    return;
                }

                const parsedUser = JSON.parse(storedUser);

                if (!parsedUser._id) {
                    setError("User ID missing. Please login again.");
                    return;
                }

                const response = await fetch(
                    `${import.meta.env.VITE_PROFILE_KEY}?userId=${parsedUser._id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || "User not found");
                    return;
                }

                setUser(data.user);
            } catch (err) {
                setError("Something went wrong");
            }
        };

        fetchProfile();
    }, []);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600">
                {error}
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ===== LEFT COLUMN ===== */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
                            {user.username.charAt(0).toUpperCase()}
                        </div>

                        <h2 className="mt-4 text-xl font-semibold text-gray-900">
                            {user.fullname || "No name added"}
                        </h2>

                        <p className="text-gray-500 text-sm">@{user.username}</p>

                        {/* Status */}
                        <span
                            className={`mt-3 px-4 py-1 rounded-full text-xs font-medium
                            ${user.isProfileCompleted
                                    ? "bg-green-500/20 text-green-500"
                                    : "bg-yellow-500/20 text-yellow-500"
                                }`}
                        >
                            {user.isProfileCompleted ? "Profile Completed" : "Profile Incomplete"}
                        </span>
                    </div>

                    <div className="mt-6 space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Role</span>
                            <span className="capitalize">{user.role}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-400">Gender</span>
                            <span className="capitalize">{user.gender || "—"}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-400">Domain</span>
                            <span>{user.domain || "—"}</span>
                        </div>
                    </div>
                </div>

                {/* ===== RIGHT COLUMN ===== */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                        Profile Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div>
                            <p className="text-gray-400">Email</p>
                            <p className="font-medium text-gray-800">{user.email}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">Phone</p>
                            <p className="font-medium text-gray-800">
                                {user.phone || "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-400">Location</p>
                            <p className="font-medium text-gray-800">
                                {user.location || "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-400">Domain</p>
                            <p className="font-medium text-gray-800">
                                {user.domain || "Not selected"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <p className="text-gray-400 mb-2">Bio</p>
                        <p className="text-gray-700 leading-relaxed">
                            {user.bio || "No bio added yet."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;