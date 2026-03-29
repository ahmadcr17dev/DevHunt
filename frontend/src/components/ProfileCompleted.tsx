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
    role: "jobseeker" | "employer" | "both";
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
        role: "jobseeker",
        domain: "",
        bio: "",
        phone: "",
        location: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500)
        return () => clearTimeout(timer);
    }, [])

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const fillUser = parsedUser || user;

        if (fillUser) {
            setFormData(prev => ({
                username: fillUser.username || prev.username,
                fullname: fillUser.fullname || prev.fullname,
                gender: fillUser.gender as "male" | "female" | "custom" || prev.gender,
                role: fillUser.role as "jobseeker" | "employer" | "both" || prev.role,
                domain: fillUser.domain || prev.domain,
                bio: fillUser.bio || prev.bio,
                phone: fillUser.phone || prev.phone,
                location: fillUser.location || prev.location,
            }));
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

        try {
            const response = await fetch(import.meta.env.VITE_PROFILECOMPLETED_KEY, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Profile update failed");

            setSuccess(data.message || "Profile completed successfully");
            setUser(data.user);
            setTimeout(() => {
                if (data.user.role === "employer") {
                    navigate("/employer");
                } else {
                    navigate("/jobspage");
                }
            }, 1500);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong");
        }
    };

    const FIELD_CLASS = "w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300";

    return (
        <>
            {loading && <Loader />}

            {/* Background with gradient */}
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8">

                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3">

                        {/* LEFT COLUMN */}
                        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white p-8 lg:p-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold">Your Account</h2>
                            </div>

                            <div className="space-y-4 text-sm">
                                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                                    <p className="text-indigo-200 text-xs uppercase tracking-wide mb-1 font-semibold">Username</p>
                                    <p className="font-semibold">{user?.username}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                                    <p className="text-indigo-200 text-xs uppercase tracking-wide mb-1 font-semibold">Email</p>
                                    <p className="font-semibold break-all">{user?.email}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                                    <p className="text-indigo-200 text-xs uppercase tracking-wide mb-1 font-semibold">Role</p>
                                    <p className="font-semibold capitalize">{user?.role}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                                    <p className="text-indigo-200 text-xs uppercase tracking-wide mb-1 font-semibold">Profile Status</p>
                                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${user?.isProfileCompleted ? "bg-green-500/90 shadow-green-500/30" : "bg-yellow-500/90 shadow-yellow-500/30"} text-white`}>
                                        <span className={`w-2 h-2 rounded-full ${user?.isProfileCompleted ? "bg-white" : "bg-white animate-pulse"}`} />
                                        {user?.isProfileCompleted ? "Completed" : "Incomplete"}
                                    </span>
                                </div>
                            </div>

                            {!user?.isProfileCompleted && (
                                <div className="mt-8 p-5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center border-2 border-yellow-500/30">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-indigo-100 font-medium">
                                            Complete your profile to unlock full features.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-2 p-8 lg:p-12">
                            <div className="mb-10">
                                <h1 className="text-4xl font-bold text-white mb-3">Complete Your Profile</h1>
                                <p className="text-xl text-slate-300">
                                    This information helps employers understand you better.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Fullname */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-3">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullname"
                                        value={formData.fullname}
                                        onChange={handleChange}
                                        className={FIELD_CLASS}
                                        required
                                    />
                                </div>

                                {/* Username */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-3">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className={FIELD_CLASS}
                                        required
                                    />
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-3">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className={FIELD_CLASS}
                                        required
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-3">Role</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className={FIELD_CLASS}
                                        required
                                    >
                                        <option value="jobseeker">Job Seeker</option>
                                        <option value="employer">Employer</option>
                                    </select>
                                </div>

                                {/* Domain */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-3">Domain</label>
                                    <select
                                        name="domain"
                                        value={formData.domain}
                                        onChange={handleChange}
                                        className={FIELD_CLASS}
                                        required
                                    >
                                        <option value="">Select Domain</option>
                                        <option value="Information Technology">Information Technology</option>
                                        <option value="Design & Creation">Design & Creative</option>
                                        <option value="Marketing & Sales">Marketing & Sales</option>
                                        <option value="Business & Management">Business & Management</option>
                                        <option value="Finance & Admin">Finance & Admin</option>
                                    </select>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-3">Phone</label>
                                    <div className="relative">
                                        <PhoneInput
                                            country="us"
                                            value={formData.phone}
                                            onChange={handlePhoneChange}
                                            inputProps={{ name: "phone", required: true }}
                                            containerClass="w-full"
                                            inputClass="!w-full !py-3 !pl-12 !rounded-xl !bg-slate-800/50 !border-slate-700 !text-white !placeholder-slate-500 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500/20 !focus:!outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-3">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className={FIELD_CLASS}
                                        required
                                    />
                                </div>

                                {/* Bio */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-300 mb-3">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows={6}
                                        minLength={100}
                                        maxLength={1500}
                                        className={`${FIELD_CLASS} resize-none`}
                                        required
                                    />
                                    <p className="text-xs text-slate-500 mt-2">{formData.bio.length}/1500</p>
                                </div>

                                {/* Error & Success Messages */}
                                {error && (
                                    <div className="md:col-span-2 px-6 py-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-red-400 text-sm font-medium">{error}</p>
                                    </div>
                                )}

                                {success && (
                                    <div className="md:col-span-2 px-6 py-4 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <p className="text-green-400 text-sm font-medium">{success}</p>
                                    </div>
                                )}

                                <div className="md:col-span-2">
                                    <button
                                        type="submit"
                                        className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 border border-slate-700/50 hover:cursor-pointer"
                                    >
                                        <span>Save Profile</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileCompleted;