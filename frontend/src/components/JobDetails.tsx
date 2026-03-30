import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FiMapPin, FiBriefcase, FiClock, FiShare2, FiBookmark, FiBookOpen, FiCheckCircle, FiStar, FiArrowLeft } from "react-icons/fi";
import Loader from "./Loader";
import Navbar from "./Navbar";

interface Job {
    _id: string
    jobTitle: string
    companyName: string
    companyLocation: string
    jobLocation: string
    jobType: "Full Time" | "Part Time" | "Contract" | "Internship" | "Temporary" | "Fresher"
    jobLocationType: "Remote" | "Onsite" | "Hybrid"
    jobCategory: string
    minSalary: number
    maxSalary: number
    salaryCurrency: string
    expireAt: string
    jobSkills: string[]
    status: "active" | "closed"
    createdAt: string
    applicantsCount?: number
    jobDescription: string
    jobResponsibilities: string
    jobRequirements: string
}

const JobDetails = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const jobFromState = location.state?.job as Job | undefined;

        if (jobFromState && jobFromState._id === jobId) {
            setJob(jobFromState);
            setLoading(false);
            return;
        }

        setLoading(false);
    }, [location.state, jobId]);

    const formatSalary = (minSalary: number, maxSalary: number, currency: string) =>
        `${currency} ${minSalary.toLocaleString()} - ${maxSalary.toLocaleString()}`;

    const timeAgo = (dateString: string) => {
        const now = new Date();
        const jobDate = new Date(dateString);
        const diff = now.getTime() - jobDate.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        return days === 0 ? "Today" : `${days}d ago`;
    };

    if (loading) return <Loader />;

    if (!job) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 sm:p-8">
            <div className="text-center max-w-sm w-full">
                <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <FiBriefcase className="w-10 h-10 text-slate-600" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Job Not Found</h1>
                <p className="text-slate-400 text-sm sm:text-base mb-8 leading-relaxed">The job you're looking for doesn't exist or has been removed.</p>
                <button
                    onClick={() => navigate("/jobspage")}
                    className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl max-w-sm mx-auto block"
                >
                    ← Back to Jobs
                </button>
            </div>
        </div>
    );

    return (
        <>
            <Navbar />
            <div className="pt-26 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {/* Breadcrumb - Mobile */}
                <div className="max-w-7xl mx-auto px-4 py-4 lg:hidden">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors mb-2"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Back to search results
                    </button>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3/4 lg:gap-10 gap-6">

                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Job Header */}
                            <div className="bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl">
                                <div className="space-y-6">

                                    {/* Title & Company */}
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between flex-wrap gap-4">
                                            <div className="flex-1 min-w-0">
                                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight break-words">
                                                    {job.jobTitle}
                                                </h1>
                                                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-400">
                                                    <div className="flex items-center gap-2 font-semibold text-white">
                                                        <FiBriefcase className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                                        {job.companyName}
                                                    </div>
                                                    <div className="w-px h-4 bg-slate-600" />
                                                    <div className="flex items-center gap-2">
                                                        <FiMapPin className="w-4 h-4 text-emerald-400" />
                                                        <span>{job.jobLocation}</span>
                                                        <span className="font-medium">({job.jobLocationType})</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Posted info */}
                                            <div className="text-right flex-shrink-0 text-xs sm:text-sm">
                                                <div className="flex items-center justify-end gap-2 text-slate-500 mb-1">
                                                    <FiClock className="w-3 h-3 flex-shrink-0" />
                                                    Posted {timeAgo(job.createdAt)}
                                                </div>
                                                {job.applicantsCount && (
                                                    <div className="text-slate-500">
                                                        {job.applicantsCount} applicants
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Salary & Tags */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 bg-slate-750/50 border border-slate-700/50 rounded-2xl">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-2 h-7 bg-gradient-to-b from-emerald-400 to-emerald-500 rounded-full flex-shrink-0" />
                                            <div>
                                                <p className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-400 leading-tight">
                                                    {formatSalary(job.minSalary, job.maxSalary, job.salaryCurrency)}
                                                </p>
                                                <p className="text-xs sm:text-sm text-slate-500">Employer est.</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <div className={`px-3 py-2 rounded-lg text-xs font-semibold border flex-shrink-0 ${job.jobLocationType === 'Remote'
                                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                                : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                                }`}>
                                                {job.jobLocationType}
                                            </div>
                                            <div className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-xs text-slate-300 rounded-lg font-medium">
                                                {job.jobType}
                                            </div>
                                        </div>
                                    </div>

                                    {/* CTA Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                        <button className="flex-1 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base h-14">
                                            <FiBriefcase className="w-4 h-4 flex-shrink-0" />
                                            Apply Now
                                        </button>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <button className="p-3 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-all flex items-center justify-center shadow-md hover:shadow-lg">
                                                <FiShare2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-3 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-400 hover:text-yellow-400 transition-all flex items-center justify-center shadow-md hover:shadow-lg">
                                                <FiBookmark className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Job Description */}
                            <div className="bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl">
                                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <FiBookOpen className="w-6 h-6 text-blue-400 flex-shrink-0" />
                                    About this job
                                </h2>
                                <div
                                    className="text-sm sm:text-base text-slate-300 leading-relaxed prose prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: job.jobDescription.replace(/\n/g, '<br/>')
                                    }}
                                />
                            </div>

                            {/* Responsibilities */}
                            <div className="bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl">
                                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <FiCheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                                    What you'll do
                                </h2>
                                <ul className="space-y-3 text-sm sm:text-base text-slate-300">
                                    {job.jobResponsibilities.split('\n').filter(Boolean).map((resp, i) => (
                                        <li key={i} className="flex items-start gap-3 pl-1 hover:translate-x-2 transition-transform group">
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2.5 flex-shrink-0 group-hover:scale-125 transition-transform" />
                                            <span className="leading-relaxed">{resp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Requirements */}
                            <div className="bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl">
                                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <FiStar className="w-6 h-6 text-amber-400 flex-shrink-0" />
                                    What you need to succeed
                                </h2>
                                <ul className="space-y-3 text-sm sm:text-base text-slate-300">
                                    {job.jobRequirements.split('\n').filter(Boolean).map((req, i) => (
                                        <li key={i} className="flex items-start gap-3 pl-1 hover:translate-x-2 transition-transform group">
                                            <div className="w-2 h-2 bg-amber-400 rounded-full mt-2.5 flex-shrink-0 group-hover:scale-125 transition-transform" />
                                            <span className="leading-relaxed">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 self-start lg:pt-4">

                            {/* Company Card */}
                            <div className="bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-5">Company</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-slate-750/50 rounded-2xl hover:bg-slate-700/30 transition-all">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                            <FiBriefcase className="w-7 h-7 text-blue-400" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-white text-sm sm:text-base truncate">{job.companyName}</p>
                                            <p className="text-xs sm:text-sm text-slate-400 truncate">{job.companyLocation}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Job Details */}
                            {/* Combined Job Details + Skills - SIDE BY SIDE */}
                            <div className="bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-6">Job details</h3>

                                {/* Grid Layout - Side by Side */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6">

                                    {/* Left Column - Job Details */}
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                                                <FiBriefcase className="w-3.5 h-3.5 flex-shrink-0" />
                                                Job type
                                            </div>
                                            <div className="font-semibold text-white capitalize text-sm">{job.jobType}</div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                                                <FiMapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                                Location type
                                            </div>
                                            <div className="font-semibold text-white capitalize text-sm">{job.jobLocationType}</div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                                                <FiClock className="w-3.5 h-3.5 flex-shrink-0" />
                                                Expires
                                            </div>
                                            <div className="font-semibold text-white text-xs">
                                                {new Date(job.expireAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Skills */}
                                    <div>
                                        <div className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">Skills</div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {job.jobSkills.slice(0, 9).map((skill, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1.5 bg-slate-750/50 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-600/50 hover:border-blue-500/50 hover:text-blue-300 transition-all truncate"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {job.jobSkills.length > 9 && (
                                                <span className="px-3 py-1.5 text-xs text-slate-500 bg-slate-750/30 rounded-lg border border-slate-600/50">
                                                    +{job.jobSkills.length - 6} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default JobDetails;