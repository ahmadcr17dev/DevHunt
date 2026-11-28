import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API } from "../config/api";
import {
    FiSearch,
    FiMapPin,
    FiBriefcase,
    FiFilter,
    FiClock,
    FiX,
} from "react-icons/fi";
import Navbar from "./Navbar";

interface Job {
    _id: string;
    jobTitle: string;
    companyName: string;
    companyLocation: string;
    jobLocation: string;
    jobType:
        | "Full Time"
        | "Part Time"
        | "Contract"
        | "Internship"
        | "Temporary"
        | "Fresher";
    jobLocationType: "Remote" | "Onsite" | "Hybrid";
    jobCategory: string;
    minSalary: number;
    maxSalary: number;
    salaryCurrency: string;
    salaryType: "Hourly" | "Monthly" | "Yearly";
    expireAt: string;
    jobSkills: string[];
    status: "active" | "closed";
    createdAt: string;
    applicantsCount?: number;
}

type Filters = {
    search: string;
    location: string;
    jobType: string;
    jobCategory: string;
    jobLocationType: string;
};

const CATEGORIES = [
    "Information Technology",
    "Design & Creative",
    "Marketing & Sales",
    "Business & Management",
    "Finance & Admin",
    "Healthcare",
    "Education",
    "Engineering",
];

const emptyFilters: Filters = {
    search: "",
    location: "",
    jobType: "",
    jobCategory: "",
    jobLocationType: "",
};

const JobPage = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<Filters>(emptyFilters);
    const [appliedFilters, setAppliedFilters] = useState<Filters>(emptyFilters);
    const [total, setTotal] = useState(0);

    const fetchJobs = useCallback(async (active: Filters) => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            // Backend search covers title, company, and jobLocation
            const searchValue = [active.search, active.location]
                .filter(Boolean)
                .join(" ")
                .trim();
            if (searchValue) params.set("search", searchValue);
            if (active.jobType) params.set("jobType", active.jobType);
            if (active.jobLocationType) {
                params.set("jobLocationType", active.jobLocationType);
            }
            if (active.jobCategory) params.set("jobCategory", active.jobCategory);

            const query = params.toString();
            const res = await axios.get(
                query ? `${API.getAllJobs}?${query}` : API.getAllJobs
            );

            setJobs(res.data.jobs || []);
            setTotal(typeof res.data.total === "number" ? res.data.total : 0);
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
            setError("Could not load jobs. Please try again.");
            setJobs([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchJobs(appliedFilters);
    }, [appliedFilters, fetchJobs]);

    const updateFilter = (key: keyof Filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        setAppliedFilters({ ...filters });
    };

    const clearFilters = () => {
        setFilters(emptyFilters);
        setAppliedFilters(emptyFilters);
    };

    const openJob = (job: Job) => {
        navigate(`/jobdetail/${job._id}`, { state: { job } });
    };

    const fieldClass =
        "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors focus:border-accent";

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-bg pt-20">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                            Find Your Next Role
                        </h1>
                        <p className="mt-2 text-muted">
                            {loading
                                ? "Searching open positions…"
                                : `${total} job${total === 1 ? "" : "s"} available`}
                        </p>
                    </div>

                    {/* Search bar — Indeed-like */}
                    <div className="mb-6 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5">
                        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                            <div className="relative">
                                <FiSearch
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    placeholder="Job title, keywords, or company"
                                    value={filters.search}
                                    onChange={(e) =>
                                        updateFilter("search", e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") applyFilters();
                                    }}
                                    className={`${fieldClass} pl-10`}
                                />
                            </div>
                            <div className="relative">
                                <FiMapPin
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    placeholder="City, region, or remote"
                                    value={filters.location}
                                    onChange={(e) =>
                                        updateFilter("location", e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") applyFilters();
                                    }}
                                    className={`${fieldClass} pl-10`}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={applyFilters}
                                className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover cursor-pointer"
                            >
                                Find jobs
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-4">
                        {/* Filters */}
                        <aside className="lg:col-span-1">
                            <div className="sticky top-24 rounded-2xl border border-border bg-surface p-5">
                                <div className="mb-5 flex items-center justify-between">
                                    <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
                                        <FiFilter size={16} />
                                        Filters
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="inline-flex items-center gap-1 text-xs font-medium text-muted transition-colors hover:text-accent cursor-pointer"
                                    >
                                        <FiX size={12} />
                                        Clear
                                    </button>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted">
                                            Job type
                                        </label>
                                        <select
                                            value={filters.jobType}
                                            onChange={(e) =>
                                                updateFilter("jobType", e.target.value)
                                            }
                                            className={fieldClass}
                                        >
                                            <option value="">All types</option>
                                            <option value="Full Time">Full Time</option>
                                            <option value="Part Time">Part Time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Internship">Internship</option>
                                            <option value="Temporary">Temporary</option>
                                            <option value="Fresher">Fresher</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted">
                                            Category
                                        </label>
                                        <select
                                            value={filters.jobCategory}
                                            onChange={(e) =>
                                                updateFilter(
                                                    "jobCategory",
                                                    e.target.value
                                                )
                                            }
                                            className={fieldClass}
                                        >
                                            <option value="">All categories</option>
                                            {CATEGORIES.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted">
                                            Work type
                                        </label>
                                        <select
                                            value={filters.jobLocationType}
                                            onChange={(e) =>
                                                updateFilter(
                                                    "jobLocationType",
                                                    e.target.value
                                                )
                                            }
                                            className={fieldClass}
                                        >
                                            <option value="">All</option>
                                            <option value="Remote">Remote</option>
                                            <option value="Hybrid">Hybrid</option>
                                            <option value="Onsite">Onsite</option>
                                        </select>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={applyFilters}
                                        className="w-full rounded-lg border border-accent bg-accent-soft px-4 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white cursor-pointer"
                                    >
                                        Apply filters
                                    </button>
                                </div>
                            </div>
                        </aside>

                        {/* Results */}
                        <section className="lg:col-span-3">
                            {loading ? (
                                <div className="space-y-4">
                                    {[0, 1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className="animate-pulse rounded-2xl border border-border bg-surface p-6"
                                        >
                                            <div className="mb-3 h-5 w-2/3 rounded bg-border" />
                                            <div className="mb-4 h-4 w-1/3 rounded bg-border" />
                                            <div className="h-4 w-1/2 rounded bg-border" />
                                        </div>
                                    ))}
                                </div>
                            ) : error ? (
                                <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
                                    <FiBriefcase
                                        className="mx-auto mb-4 text-muted"
                                        size={40}
                                    />
                                    <h3 className="font-display text-xl font-semibold text-ink">
                                        Something Went Wrong
                                    </h3>
                                    <p className="mt-2 text-sm text-muted">{error}</p>
                                    <button
                                        type="button"
                                        onClick={() => fetchJobs(appliedFilters)}
                                        className="mt-6 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover cursor-pointer"
                                    >
                                        Try again
                                    </button>
                                </div>
                            ) : jobs.length === 0 ? (
                                <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
                                    <FiBriefcase
                                        className="mx-auto mb-4 text-muted"
                                        size={40}
                                    />
                                    <h3 className="font-display text-xl font-semibold text-ink">
                                        No Jobs Found
                                    </h3>
                                    <p className="mt-2 text-sm text-muted">
                                        Try adjusting your search or filters.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="mt-6 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover cursor-pointer"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-sm text-muted">
                                        Showing{" "}
                                        <span className="font-medium text-ink">
                                            {jobs.length}
                                        </span>{" "}
                                        of {total}
                                    </p>
                                    {jobs.map((job) => (
                                        <JobCard
                                            key={job._id}
                                            job={job}
                                            onOpen={() => openJob(job)}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

const formatSalary = (
    min: number,
    max: number,
    currency: string,
    salaryType: string
) =>
    `${currency} ${min.toLocaleString()}–${max.toLocaleString()} / ${salaryType.toLowerCase()}`;

const formatPostedDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

const JobCard = ({ job, onOpen }: { job: Job; onOpen: () => void }) => {
    return (
        <article
            role="button"
            tabIndex={0}
            onClick={onOpen}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpen();
                }
            }}
            className="group cursor-pointer rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:border-accent/40 hover:shadow-[0_8px_24px_rgba(14,124,123,0.08)] sm:p-6"
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-lg font-semibold text-ink transition-colors group-hover:text-accent">
                            {job.jobTitle}
                        </h3>
                        <span className="rounded-md border border-border bg-bg px-2 py-0.5 text-xs font-medium text-muted">
                            {job.jobType}
                        </span>
                    </div>

                    <p className="text-sm font-medium text-ink/80">{job.companyName}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
                        <span className="inline-flex items-center gap-1">
                            <FiMapPin size={12} />
                            {job.jobLocation}
                        </span>
                        <span className="rounded-md border border-accent/20 bg-accent-soft px-2 py-0.5 font-medium text-accent">
                            {job.jobLocationType}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <FiClock size={12} />
                            {formatPostedDate(job.createdAt)}
                        </span>
                        {job.jobCategory && <span>{job.jobCategory}</span>}
                    </div>

                    {(job.minSalary > 0 || job.maxSalary > 0) && (
                        <p className="mt-3 text-sm font-semibold text-success">
                            {formatSalary(
                                job.minSalary,
                                job.maxSalary,
                                job.salaryCurrency || "",
                                job.salaryType
                            )}
                        </p>
                    )}

                    {job.jobSkills?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {job.jobSkills.slice(0, 4).map((skill) => (
                                <span
                                    key={skill}
                                    className="rounded-md bg-bg px-2 py-1 text-xs text-muted"
                                >
                                    {skill}
                                </span>
                            ))}
                            {job.jobSkills.length > 4 && (
                                <span className="text-xs text-muted">
                                    +{job.jobSkills.length - 4}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpen();
                    }}
                    className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover cursor-pointer"
                >
                    View job
                </button>
            </div>
        </article>
    );
};

export default JobPage;
