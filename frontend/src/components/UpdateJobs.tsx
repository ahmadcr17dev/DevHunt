import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {
    FiBriefcase,
    FiEdit2,
    FiTrash2,
    FiMapPin,
    FiClock,
    FiAlertTriangle,
    FiPlus,
    FiSearch,
} from "react-icons/fi"

interface Job {
    _id: string
    jobTitle: string
    companyName: string
    jobLocation: string
    jobType: "Full Time" | "Part Time" | "Contract" | "Internship" | "Temporary" | "Fresher"
    jobLocationType: "Remote" | "Onsite" | "Hybrid"
    status: "active" | "closed"
    createdAt: string
}

// ── Delete Modal ─────────────────────────────────────────

const DeleteModal = ({
    job,
    onConfirm,
    onCancel,
    deleting,
}: {
    job: Job
    onConfirm: () => void
    onCancel: () => void
    deleting: boolean
}) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <FiAlertTriangle className="text-red-400" size={22} />
            </div>
            <h3 className="text-center text-white font-semibold text-lg mb-1">Delete Job?</h3>
            <p className="text-center text-slate-400 text-sm mb-6">
                <span className="text-white font-medium">"{job.jobTitle}"</span> will be permanently removed.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={onCancel}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium transition-colors hover:cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={deleting}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors hover:cursor-pointer"
                >
                    {deleting ? "Deleting..." : "Yes, Delete"}
                </button>
            </div>
        </div>
    </div>
)

// ── Job Type Badge ────────────────────────────────────────

const JOB_TYPE_COLORS: Record<string, string> = {
    "Full Time": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Part Time": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "Contract": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "Internship": "bg-green-500/10 text-green-400 border-green-500/20",
    "Temporary": "bg-orange-500/10 text-orange-400 border-orange-500/20",
    "Fresher": "bg-teal-500/10 text-teal-400 border-teal-500/20",
}

const LOCATION_TYPE_COLORS: Record<string, string> = {
    "Remote": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "Onsite": "bg-slate-500/10 text-slate-400 border-slate-500/20",
    "Hybrid": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
}

// ── Main Component ───────────────────────────────────────

const UpdateJobs = () => {
    const navigate = useNavigate()
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [search, setSearch] = useState("")
    const [jobToDelete, setJobToDelete] = useState<Job | null>(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        try {
            setLoading(true)
            const res = await axios.get(
                `${import.meta.env.VITE_GET_MY_JOBS}`,
                { withCredentials: true }
            )
            setJobs(res.data.jobs)
        } catch {
            setError("Failed to load jobs. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!jobToDelete) return
        setDeleting(true)
        try {
            await axios.delete(
                `${import.meta.env.VITE_DELETE_JOB}/${jobToDelete._id}`,
                { withCredentials: true }
            )
            setJobs((prev) => prev.filter((j) => j._id !== jobToDelete._id))
            setJobToDelete(null)
            setSuccess("Job deleted successfully.")
            setTimeout(() => setSuccess(""), 1500)
        } catch {
            setError("Failed to delete job.")
            setTimeout(() => setError(""), 1500)
        } finally {
            setDeleting(false)
        }
    }

    const filteredJobs = jobs.filter(
        (j) =>
            j.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
            j.companyName.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-3 text-slate-400">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="text-sm">Loading jobs...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Update Jobs</h1>
                    <p className="text-slate-400 text-sm mt-1">{jobs.length} job{jobs.length !== 1 ? "s" : ""} posted</p>
                </div>
                <button
                    onClick={() => navigate("/employer/createjob")}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/20 hover:cursor-pointer"
                >
                    <FiPlus size={16} />
                    Post a Job
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <FiSearch size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by job title or company..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                />
            </div>

            {/* Alerts */}
            {error && (
                <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
                    {success}
                </div>
            )}

            {/* Job List */}
            {filteredJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 mb-4 rounded-2xl bg-slate-800 flex items-center justify-center">
                        <FiBriefcase size={28} className="text-slate-500" />
                    </div>
                    <p className="text-slate-300 font-medium mb-1">No jobs found</p>
                    <p className="text-slate-500 text-sm">
                        {search ? "Try a different search term." : "You haven't posted any jobs yet."}
                    </p>
                </div>
            ) : (
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden">

                    {/* List Header */}
                    <div className="grid grid-cols-12 px-5 py-3 border-b border-slate-700/50 bg-slate-800/50">
                        <span className="col-span-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Job</span>
                        <span className="col-span-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:block">Type</span>
                        <span className="col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:block">Status</span>
                        <span className="col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</span>
                    </div>

                    {/* List Rows */}
                    <div className="divide-y divide-slate-700/50">
                        {filteredJobs.map((job) => (
                            <div
                                key={job._id}
                                className="grid grid-cols-12 items-center px-5 py-4 hover:bg-slate-700/20 transition-colors duration-200 group"
                            >
                                {/* Job Info */}
                                <div className="col-span-5 sm:col-span-5 min-w-0 pr-3">
                                    <p className="text-white font-semibold text-sm truncate group-hover:text-blue-400 transition-colors duration-200">
                                        {job.jobTitle}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <p className="text-slate-400 text-xs truncate">{job.companyName}</p>
                                        <span className="text-slate-600">·</span>
                                        <FiMapPin size={10} className="text-slate-500 flex-shrink-0" />
                                        <p className="text-slate-500 text-xs truncate">{job.jobLocation}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1 sm:hidden">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${JOB_TYPE_COLORS[job.jobType]}`}>
                                            {job.jobType}
                                        </span>
                                    </div>
                                </div>

                                {/* Job Type */}
                                <div className="col-span-3 hidden sm:flex flex-col gap-1.5">
                                    <span className={`w-fit text-xs font-medium px-2.5 py-1 rounded-full border ${JOB_TYPE_COLORS[job.jobType]}`}>
                                        {job.jobType}
                                    </span>
                                    <span className={`w-fit text-xs font-medium px-2.5 py-1 rounded-full border ${LOCATION_TYPE_COLORS[job.jobLocationType]}`}>
                                        {job.jobLocationType}
                                    </span>
                                </div>

                                {/* Status */}
                                <div className="col-span-2 hidden md:flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${job.status === "active" ? "bg-green-400" : "bg-slate-500"}`} />
                                    <span className={`text-xs font-medium capitalize ${job.status === "active" ? "text-green-400" : "text-slate-400"}`}>
                                        {job.status}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="col-span-7 sm:col-span-2 md:col-span-2 flex items-center justify-end gap-2">
                                    <span className="text-slate-600 text-xs mr-auto md:hidden">
                                        <FiClock size={10} className="inline mr-1" />
                                        {new Date(job.createdAt).toLocaleDateString()}
                                    </span>
                                    <button
                                        onClick={() => navigate(`${import.meta.env.VITE_UPDATE_JOB}/${job._id}`)}
                                        className="p-2 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200 hover:cursor-pointer"
                                        title="Edit job"
                                    > 
                                        <FiEdit2 size={15} />
                                    </button>
                                    <button
                                        onClick={() => setJobToDelete(job)}
                                        className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 hover:cursor-pointer"
                                        title="Delete job"
                                    >
                                        <FiTrash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* List Footer */}
                    <div className="px-5 py-3 border-t border-slate-700/50 bg-slate-800/50">
                        <p className="text-xs text-slate-500">
                            Showing {filteredJobs.length} of {jobs.length} jobs
                        </p>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {jobToDelete && (
                <DeleteModal
                    job={jobToDelete}
                    onConfirm={handleDelete}
                    onCancel={() => setJobToDelete(null)}
                    deleting={deleting}
                />
            )}
        </div>
    )
}

export default UpdateJobs;