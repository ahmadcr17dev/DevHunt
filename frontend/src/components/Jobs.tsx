import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {
    FiSearch,
    FiMapPin,
    FiBriefcase,
    FiFilter,
    FiClock,
    FiBookmark,
} from "react-icons/fi"
import Navbar from "./Navbar"

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
}

const JobPage = () => {
    const navigate = useNavigate()
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        search: "",
        location: "",
        jobType: "",
        category: "",
        remote: "",
        salaryMin: "",
        salaryMax: "",
    })
    const [stats, setStats] = useState(0)

    // Filters data
    const categories = [
        "All Categories", "Information Technology", "Design & Creative",
        "Marketing & Sales", "Business & Management", "Finance & Admin",
        "Healthcare", "Education", "Engineering"
    ]

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = useCallback(async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value)
            })

            const res = await axios.get(
                `${import.meta.env.VITE_GET_ALL_JOBS}?${params.toString()}`,
                { withCredentials: true }
            )

            setJobs(res.data.jobs || [])
            setStats(res.data.total)
        } catch (error) {
            console.error("Failed to fetch jobs:", error)
        } finally {
            setLoading(false)
        }
    }, [filters])

    const handleApplyNow = (job: Job) => {
        navigate(`/jobdetail/${job._id}`,
            {
                state: { job }
            }
        );
    }

    const updateFilter = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const clearFilters = () => {
        setFilters({
            search: "",
            location: "",
            jobType: "",
            category: "",
            remote: "",
            salaryMin: "",
            salaryMax: "",
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading jobs...</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {/* Decorative elements */}
                <div className="inset-0 overflow-hidden pointer-events-none">
                    <div className="left-1/4 w-72 h-18 bg-blue-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4">
                            Find Your Dream Job
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            {stats} jobs available
                        </p>
                    </div>

                    {/* Search & Filters */}
                    <div className="grid lg:grid-cols-3 gap-6 mb-8">

                        {/* Main Search */}
                        <div className="lg:col-span-2">
                            <div className="relative group">
                                <FiSearch
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                                    size={20}
                                />
                                <input
                                    type="text"
                                    placeholder="Search job titles, companies, skills..."
                                    value={filters.search}
                                    onChange={(e) => updateFilter("search", e.target.value)}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-12 pr-4 py-2 text-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-lg hover:shadow-blue-500/10"
                                />
                            </div>
                        </div>

                        {/* Quick Filters */}
                        <div className="flex gap-3 lg:justify-end">
                            <button className="px-10 py-2 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 hover:text-white text-sm font-medium transition-all duration-300 flex items-center gap-2 hover:cursor-pointer">
                                <FiFilter size={16} />
                                Filters
                            </button>
                            <button
                                onClick={clearFilters}
                                className="px-10 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 hover:cursor-pointer"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>

                    {/* Filters Sidebar (Mobile/Desktop) */}
                    <div className="lg:grid lg:grid-cols-4 lg:gap-8 mb-8">
                        <div className="lg:col-span-1 mb-6 lg:mb-0">
                            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 sticky top-24">
                                <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                                    <FiFilter size={18} />
                                    Filters
                                </h3>

                                {/* Location */}
                                <div className="space-y-3 mb-6">
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Location</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. New York"
                                        value={filters.location}
                                        onChange={(e) => updateFilter("location", e.target.value)}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                                    />
                                </div>

                                {/* Job Type */}
                                <div className="space-y-3 mb-6">
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Job Type</label>
                                    <select
                                        value={filters.jobType}
                                        onChange={(e) => updateFilter("jobType", e.target.value)}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                                    >
                                        <option value="">All Types</option>
                                        <option value="Full Time">Full Time</option>
                                        <option value="Part Time">Part Time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                </div>

                                {/* Category */}
                                <div className="space-y-3 mb-6">
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
                                    <select
                                        value={filters.category}
                                        onChange={(e) => updateFilter("category", e.target.value)}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Remote */}
                                <div className="space-y-3 mb-6">
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Work Type</label>
                                    <select
                                        value={filters.remote}
                                        onChange={(e) => updateFilter("remote", e.target.value)}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                                    >
                                        <option value="">All</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Hybrid">Hybrid</option>
                                        <option value="Onsite">Onsite</option>
                                    </select>
                                </div>

                                {/* Salary Range */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Salary Range</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={filters.salaryMin}
                                            onChange={(e) => updateFilter("salaryMin", e.target.value)}
                                            className="bg-slate-700/50 border border-slate-600 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={filters.salaryMax}
                                            onChange={(e) => updateFilter("salaryMax", e.target.value)}
                                            className="bg-slate-700/50 border border-slate-600 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Jobs Grid */}
                        <div className="lg:col-span-3 space-y-4">
                            {jobs.length === 0 ? (
                                <div className="text-center py-20">
                                    <FiBriefcase className="w-16 h-16 text-slate-600 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold text-white mb-2">No jobs found</h3>
                                    <p className="text-slate-400 mb-6">Try adjusting your filters or search terms</p>
                                    <button
                                        onClick={clearFilters}
                                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 mb-6">
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                                            <span className="font-semibold">{jobs.length} jobs</span>
                                            <span className="text-slate-500">·</span>
                                            <span>Sort by: <span className="text-white font-medium">Relevance</span></span>
                                        </div>
                                    </div>

                                    {jobs.map((job) => (
                                        <JobCard key={job._id} job={job} onApply={() => handleApplyNow(job)} />
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

// ── Job Card Component ─────────────────────────────────────

const JobCard = ({ job, onApply }: { job: Job; onApply: () => void }) => {
    const formatSalary = (min: number, max: number, currency: string) => {
        return `${currency} ${min.toLocaleString()}-${max.toLocaleString()} / yr`
    }

    const timeAgo = (date: string) => {
        const now = new Date()
        const jobDate = new Date(date)
        const diff = now.getTime() - jobDate.getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        return days === 0 ? "Today" : `${days}d ago`
    }

    const JOB_TYPE_COLORS: Record<string, string> = {
        "Full Time": "bg-blue-500/10 text-blue-400 border-blue-500/30",
        "Part Time": "bg-purple-500/10 text-purple-400 border-purple-500/30",
        "Contract": "bg-amber-500/10 text-amber-400 border-amber-500/30",
        "Internship": "bg-green-500/10 text-green-400 border-green-500/30",
        "Temporary": "bg-orange-500/10 text-orange-400 border-orange-500/30",
        "Fresher": "bg-teal-500/10 text-teal-400 border-teal-500/30",
    }

    const LOCATION_TYPE_COLORS: Record<string, string> = {
        "Remote": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        "Onsite": "bg-slate-500/10 text-slate-400 border-slate-500/30",
        "Hybrid": "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    }

    return (
        <div className="group bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 hover:bg-slate-700/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                    {/* Company Logo Placeholder */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FiBriefcase className="text-blue-400" size={20} />
                    </div>

                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                            <h3 className="text-lg font-bold text-white truncate group-hover:text-blue-400 transition-colors pr-2">
                                {job.jobTitle}
                            </h3>
                            <div className={`text-xs px-2 py-1 rounded-full font-semibold border ${JOB_TYPE_COLORS[job.jobType]}`}>
                                {job.jobType}
                            </div>
                        </div>

                        <p className="text-slate-400 text-sm mb-2 truncate">{job.companyName}</p>

                        <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                            <div className="flex items-center gap-1">
                                <FiMapPin size={12} />
                                <span>{job.jobLocation}</span>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${LOCATION_TYPE_COLORS[job.jobLocationType]}`}>
                                {job.jobLocationType}
                            </div>
                            <div className="flex items-center gap-1">
                                <FiClock size={12} />
                                <span>{timeAgo(job.createdAt)}</span>
                            </div>
                        </div>

                        {/* Salary & Skills */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                                <span className="text-emerald-400 font-semibold text-sm">
                                    {formatSalary(job.minSalary, job.maxSalary, job.salaryCurrency)}
                                </span>
                            </div>
                            <div className="flex gap-1.5">
                                {job.jobSkills.slice(0, 2).map((skill, i) => (
                                    <span key={i} className="text-xs bg-slate-700/50 px-2 py-1 rounded-lg text-slate-300">
                                        {skill}
                                    </span>
                                ))}
                                {job.jobSkills.length > 2 && (
                                    <span className="text-xs text-slate-500">+{job.jobSkills.length - 2}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-2 ml-4 flex-shrink-0">
                    <button
                        onClick={onApply}
                        className="px-10 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-200 group-hover:cursor-pointer"
                    >
                        Apply Now
                    </button>
                    <button className="p-2 text-slate-500 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-xl transition-all group-hover:cursor-pointer">
                        <FiBookmark size={16} />
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <FiBriefcase size={12} />
                        {job.applicantsCount || 0} applicants
                    </span>
                    <span>{job.jobCategory}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-green-400 rounded-full"></span>
                    <span className="text-xs font-medium text-green-400">Active</span>
                </div>
            </div>
        </div>
    )
}

export default JobPage;