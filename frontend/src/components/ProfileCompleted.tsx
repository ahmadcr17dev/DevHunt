import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // required for styling
import { useNavigate } from "react-router-dom";

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
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<ProfileFormData>({
        username: user?.username || "",
        fullname: "",
        gender: "male",
        role: "jobseeker",
        domain: "",
        bio: "",
        phone: "",
        location: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // handle change for text inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // handle phone separately
    const handlePhoneChange = (value: string) => {
        setFormData({ ...formData, phone: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                setError("User not found. Please login again.");
                return;
            }

            const parsedUser = JSON.parse(storedUser);

            if (!parsedUser._id) {
                setError("User ID not found. Please login again.");
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
                return;
            }

            setSuccess(data.message || "Profile completed successfully");

            // ✅ Update localStorage with latest user data
            const updatedUser = {
                ...parsedUser,
                ...formData,
                isProfileCompleted: true,
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));

            // ✅ Redirect safely
            setTimeout(() => {
                navigate("/profile");
            }, 1500);

        } catch (err: any) {
            console.error("ProfileCompleted error:", err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3">

                    {/* LEFT COLUMN — USER INFO */}
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

                                <span
                                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${user?.isProfileCompleted
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-yellow-500/20 text-yellow-300"
                                        }`}
                                >
                                    {user?.isProfileCompleted ? "Completed" : "Incomplete"}
                                </span>
                            </div>
                        </div>

                        {!user?.isProfileCompleted && (
                            <div className="mt-10 text-xs text-gray-400">
                                Complete your profile to unlock full features and visibility.
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN — FORM */}
                    <div className="lg:col-span-2 p-6 sm:p-10">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Complete Your Profile
                        </h1>
                        <p className="text-sm text-gray-600 mb-6">
                            This information helps employers understand you better.
                        </p>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Fullname */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="fullname"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                />
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                />
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Gender</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                >
                                    <option value="jobseeker">Job Seeker</option>
                                    <option value="employer">Employer</option>
                                </select>
                            </div>

                            {/* Domain */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Domain</label>
                                <select
                                    name="domain"
                                    value={formData.domain}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                >
                                    <option value="">Select domain</option>
                                    <option value="software">Software</option>
                                    <option value="marketing">Marketing</option>
                                    <option value="finance">Finance</option>
                                    <option value="design">Design</option>
                                    <option value="hr">HR</option>
                                </select>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <PhoneInput
                                    country="us"
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    enableSearch
                                    inputProps={{
                                        name: "phone",
                                        required: true,
                                    }}
                                    containerClass="w-full"
                                    inputClass="!w-full !py-2 !pl-12 !border !rounded-lg focus:!ring-2 focus:!ring-blue-500"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                />
                            </div>

                            {/* Bio — FULL WIDTH */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows={5}
                                    minLength={100}
                                    maxLength={1500}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {error && (
                                <p className="mb-2 text-sm text-red-600">{error}</p>
                            )}

                            {success && (
                                <p className="mb-2 text-sm text-green-600">{success}</p>
                            )}

                            {/* SUBMIT */}
                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-[#004fcb] text-white font-semibold rounded-lg hover:bg-[#002970] transition hover:cursor-pointer"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCompleted;