import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

interface ProfileFormData {
    username: string;
    fullname: string;
    gender: "male" | "female" | "custom";
    role: "jobseeker" | "employer";
    domain: string;
    bio: string;
    phone: string;
    location: string;
}

const ProfileCompleted = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<ProfileFormData>({
        username: "",
        fullname: "",
        gender: "male",
        role: "employer",
        domain: "",
        bio: "",
        phone: "",
        location: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Prefill on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;

        const fillUser = parsedUser || user;

        if (fillUser) {
            setFormData({
                username: fillUser.username || "",
                fullname: fillUser.fullname || "",
                gender: fillUser.gender || "male",
                role: fillUser.role || "employer",
                domain: fillUser.domain || "",
                bio: fillUser.bio || "",
                phone: fillUser.phone || "",
                location: fillUser.location || "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (value: string) => {
        setFormData({ ...formData, phone: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                setError("User not found. Please login again.");
                setLoading(false);
                return;
            }

            const parsedUser = JSON.parse(storedUser);
            if (!parsedUser._id) {
                setError("User ID not found. Please login again.");
                setLoading(false);
                return;
            }

            const response = await fetch(import.meta.env.VITE_PROFILECOMPLETED_KEY, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    userId: parsedUser._id,
                    ...formData,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Profile completion failed");
                setLoading(false);
                return;
            }

            setSuccess(data.message || "Profile completed successfully");

            // Update Context & localStorage
            const updatedUser = { ...parsedUser, ...formData, isProfileCompleted: true };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            setTimeout(() => {
                setLoading(false);
                navigate("/profile");
            }, 1200);
        } catch (err: any) {
            console.error(err);
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <Loader />}
            {!loading && (
                <div className="min-h-screen bg-gray-100 px-4 py-8">
                    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-3">

                            {/* LEFT COLUMN */}
                            <div className="bg-slate-900 text-white p-8 lg:p-10">
                                <h2 className="text-2xl font-bold mb-6">Your Account</h2>
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <p className="text-gray-400">Username</p>
                                        <p className="font-semibold">{user?.username}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Email</p>
                                        <p className="font-semibold">{user?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Role</p>
                                        <p className="font-semibold capitalize">{user?.role}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Profile Status</p>
                                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${user?.isProfileCompleted ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-300"}`}>
                                            {user?.isProfileCompleted ? "Completed" : "Incomplete"}
                                        </span>
                                    </div>
                                </div>
                                {!user?.isProfileCompleted && (
                                    <div className="mt-10 text-xs text-gray-400">
                                        Complete your profile to unlock full features.
                                    </div>
                                )}
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="lg:col-span-2 p-6 sm:p-10">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
                                <p className="text-sm text-gray-600 mb-6">
                                    This information helps employers understand you better.
                                </p>
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Fullname */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Full Name</label>
                                        <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                                    </div>
                                    {/* Username */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Username</label>
                                        <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                                    </div>
                                    {/* Gender */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Gender</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="custom">Custom</option>
                                        </select>
                                    </div>
                                    {/* Role */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Role</label>
                                        <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required>
                                            <option value="jobseeker">Job Seeker</option>
                                            <option value="employer">Employer</option>
                                        </select>
                                    </div>
                                    {/* Domain */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Domain</label>
                                        <select name="domain" value={formData.domain} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required>
                                            <option value="">Select Domain</option>
                                            <option value="technology">Technology / IT</option>
                                            <option value="design">Design / Creative</option>
                                            <option value="marketing">Marketing / Sales</option>
                                            <option value="business">Business / Management</option>
                                            <option value="finance">Finance / Legal / Admin</option>
                                        </select>
                                    </div>
                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Phone</label>
                                        <PhoneInput country="us" value={formData.phone} onChange={handlePhoneChange} inputProps={{ name: "phone", required: true }} containerClass="w-full" inputClass="!w-full !py-2 !pl-12 !border !rounded-lg focus:!ring-2 focus:!ring-blue-500" />
                                    </div>
                                    {/* Location */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Location</label>
                                        <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                                    </div>
                                    {/* Bio */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-1">Bio</label>
                                        <textarea name="bio" value={formData.bio} onChange={handleChange} rows={5} minLength={100} maxLength={1500} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
                                    </div>

                                    {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
                                    {success && <p className="mb-2 text-sm text-green-600">{success}</p>}

                                    <div className="md:col-span-2">
                                        <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition hover:cursor-pointer">
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileCompleted;