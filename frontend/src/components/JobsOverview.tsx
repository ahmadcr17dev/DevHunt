// components/JobOverview.tsx
import React, { useState, useEffect } from 'react';
import { Trash2, MapPin, CoinsIcon, Clock, Briefcase, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

interface Job {
    _id: string;
    jobTitle: string;        // ✅ Changed from 'title'
    companyName: string;     // ✅ Changed from 'company'
    jobLocation: string;     // ✅ Changed from 'location'
    minSalary: string;
    maxSalary: string;
    salaryCurrency: string;
    jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';  // ✅ Changed from 'type'
    status: 'active' | 'closed';
    createdAt: string;
    employed?: { name: string; email: string }; // ✅ From populate
}

const JobsOverview: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Fetch jobs on component mount
    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(import.meta.env.VITE_GET_MY_JOBS, { withCredentials: true });
            // Backend returns { jobs: [...] } so access response.data.jobs
            setJobs(response.data.jobs || response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setError("Failed to fetch jobs. Try Again");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (jobId: string) => {
        if (!confirm('Are you sure you want to delete this job?')) return;

        try {
            setDeletingId(jobId);
            await axios.delete(`${import.meta.env.VITE_DELETE_JOB}/${jobId}`, { withCredentials: true }); // Your backend delete endpoint
            setJobs(jobs.filter(job => job._id !== jobId));
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Failed to delete job');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/25">
                        <Briefcase className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-4">
                        Job Listings
                    </h1>
                    <p className="text-slate-400 text-xl max-w-2xl mx-auto">
                        Manage all your active job postings with ease
                    </p>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-8 px-6 py-5 bg-red-500/10 border border-red-500/30 rounded-2xl backdrop-blur-sm flex items-center gap-3">
                        <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0" />
                        <span className="text-red-300 font-medium">{error}</span>
                        <button
                            onClick={fetchJobs}
                            className="ml-auto flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-200 rounded-xl hover:bg-red-500/30 transition-all duration-200"
                            disabled={loading}
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Retry
                        </button>
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="text-center p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl">
                        <div className="text-4xl font-black text-blue-400">{jobs.length}</div>
                        <div className="text-slate-400 text-sm font-medium mt-2 tracking-wide">Total Jobs</div>
                    </div>
                    <div className="text-center p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl">
                        <div className="text-4xl font-black text-green-400">
                            {jobs.filter(j => j.status === 'active').length}
                        </div>
                        <div className="text-slate-400 text-sm font-medium mt-2 tracking-wide">Active</div>
                    </div>
                    <div className="text-center p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl">
                        <div className="text-4xl font-black text-yellow-400">
                            {jobs.filter(j => j.status === 'closed').length}
                        </div>
                        <div className="text-slate-400 text-sm font-medium mt-2 tracking-wide">Closed</div>
                    </div>
                </div>

                {/* Jobs Grid */}
                {jobs.length === 0 ? (
                    <div className="text-center py-32">
                        <div className="inline-flex items-center justify-center w-24 h-24 mx-auto mb-8 bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-700">
                            <Briefcase className="h-12 w-12 text-slate-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">No jobs posted yet</h3>
                        <p className="text-slate-500 text-lg max-w-md mx-auto">
                            Get started by creating your first job listing.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                                onDelete={handleDelete}
                                isDeleting={deletingId === job._id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

interface JobCardProps {
    job: Job;
    onDelete: (id: string) => void;
    isDeleting: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, onDelete, isDeleting }) => {
    return (
        <div className="group bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/50 overflow-hidden">
            {/* Job Header */}
            <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-0">
                    <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-all duration-300 mb-1">
                            {job.jobTitle.slice(0, 25) + "..."}
                        </h3>
                        <p className="text-sm sm:text-base font-semibold text-slate-300 mb-4">
                            {job.companyName.slice(0, 25) + "..."}
                        </p>
                        <div className="flex items-center text-slate-400">
                            <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                            <span className="text-sm">{job.jobLocation}</span>
                        </div>
                    </div>

                    {/* Delete Button */}
                    <button
                        onClick={() => onDelete(job._id)}
                        disabled={isDeleting}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-300 hover:scale-110 ml-3 opacity-0 group-hover:opacity-100"
                        title="Delete job"
                    >
                        {isDeleting ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                        ) : (
                            <Trash2 className="h-4 w-4 hover:cursor-pointer" />
                        )}
                    </button>
                </div>

                {/* Job Details */}
                <div className="space-y-1 mb-4">
                    {(job.minSalary && job.maxSalary) && (
                        <div className="flex items-center text-slate-300">
                            <CoinsIcon className="h-4 w-4 mr-2 text-green-400 flex-shrink-0" />
                            <div>
                                <span className="text-sm font-semibold">{job.minSalary}</span>
                                <span> - </span>
                                <span className="text-sm font-semibold">{job.maxSalary}</span>
                                <span className="text-sm font-semibold text-white">{" " + job.salaryCurrency}</span>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center text-slate-400">
                        <Clock className="h-4 w-4 mr-2 text-indigo-400 flex-shrink-0" />
                        <span className="text-sm font-medium">{job.jobType}</span>
                    </div>
                </div>
            </div>

            {/* Job Footer */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border-t border-slate-700/50">
                <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${job.status.toLowerCase() === 'active'
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : job.status.toLowerCase() === 'closed'
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                        }`}>
                        {job.status}
                    </span>
                    <span className="text-slate-500 font-medium text-xs sm:text-sm">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default JobsOverview;