import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    FiMapPin,
    FiBriefcase,
    FiClock,
    FiShare2,
    FiArrowLeft,
} from "react-icons/fi";
import Navbar from "./Navbar";
import { API } from "../config/api";

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
    salaryType?: "Hourly" | "Monthly" | "Yearly";
    expireAt: string;
    jobSkills: string[];
    status: "active" | "closed";
    createdAt: string;
    applicantsCount?: number;
    jobDescription: string;
    jobResponsibilities: string;
    jobRequirements: string;
}

const formatSalary = (min: number, max: number, currency: string, type?: string) => {
    const range = `${currency || ""} ${min.toLocaleString()}–${max.toLocaleString()}`.trim();
    return type ? `${range} / ${type.toLowerCase()}` : range;
};

const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

const splitLines = (text?: string) =>
    (text || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

const JobDetails = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const detailsRef = useRef<HTMLElement>(null);

    const initialStateJob = (() => {
        const fromState = (location.state as { job?: Job } | null)?.job;
        return fromState && fromState._id === jobId ? fromState : null;
    })();

    const [job, setJob] = useState<Job | null>(initialStateJob);
    const [loading, setLoading] = useState(!initialStateJob);
    const [notFound, setNotFound] = useState(false);
    const [shareHint, setShareHint] = useState<string | null>(null);

    useEffect(() => {
        if (!jobId) {
            setNotFound(true);
            setLoading(false);
            return;
        }

        const fromState = (location.state as { job?: Job } | null)?.job;
        const stateJob =
            fromState && fromState._id === jobId ? fromState : null;

        // Instant paint from list navigation when ids match
        if (stateJob) {
            setJob(stateJob);
            setLoading(false);
            setNotFound(false);
        } else {
            setLoading(true);
        }

        let cancelled = false;
        const hadState = Boolean(stateJob);

        const load = async () => {
            try {
                const res = await axios.get(`${API.getJobById}/${jobId}`);
                if (cancelled) return;
                const serverJob = res.data?.job as Job | undefined;
                if (!serverJob) {
                    setNotFound(true);
                    setJob(null);
                    return;
                }
                setJob(serverJob);
                setNotFound(false);
            } catch (err) {
                if (cancelled) return;
                const status = axios.isAxiosError(err)
                    ? err.response?.status
                    : undefined;
                if (status === 404 || !hadState) {
                    setJob(null);
                    setNotFound(true);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void load();
        return () => {
            cancelled = true;
        };
    }, [jobId, location.state]);

    const handleShare = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({ title: job?.jobTitle, url });
                return;
            }
            await navigator.clipboard.writeText(url);
            setShareHint("Link copied");
            window.setTimeout(() => setShareHint(null), 2000);
        } catch {
            setShareHint("Could not share");
            window.setTimeout(() => setShareHint(null), 2000);
        }
    };

    if (loading && !job) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-bg pt-24">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6">
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 w-28 rounded bg-border" />
                            <div className="h-10 w-3/4 rounded bg-border" />
                            <div className="h-5 w-1/2 rounded bg-border" />
                            <div className="h-5 w-2/3 rounded bg-border" />
                            <div className="mt-8 flex gap-3">
                                <div className="h-11 w-36 rounded-lg bg-border" />
                                <div className="h-11 w-28 rounded-lg bg-border" />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (notFound || !job) {
        return (
            <>
                <Navbar />
                <div className="flex min-h-screen items-center justify-center bg-bg px-4 pt-20">
                    <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft">
                            <FiBriefcase className="text-accent" size={24} />
                        </div>
                        <h1 className="font-display text-2xl font-semibold text-ink">
                            Job not found
                        </h1>
                        <p className="mt-2 text-sm text-muted">
                            This role doesn&apos;t exist or is no longer available.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/jobspage")}
                            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover cursor-pointer"
                        >
                            <FiArrowLeft size={16} />
                            Back to jobs
                        </button>
                    </div>
                </div>
            </>
        );
    }

    const responsibilities = splitLines(job.jobResponsibilities);
    const requirements = splitLines(job.jobRequirements);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-bg pt-20">
                {/* Hero / first viewport */}
                <section className="relative overflow-hidden border-b border-border">
                    <div
                        className="pointer-events-none absolute inset-0 opacity-90"
                        aria-hidden="true"
                        style={{
                            background:
                                "radial-gradient(ellipse 70% 60% at 90% 0%, rgba(14,124,123,0.12), transparent 55%), radial-gradient(ellipse 50% 40% at 0% 100%, rgba(231,244,243,0.85), transparent 50%)",
                        }}
                    />

                    <div className="relative mx-auto max-w-3xl px-4 pb-12 pt-8 sm:px-6 sm:pt-12">
                        <button
                            type="button"
                            onClick={() => navigate("/jobspage")}
                            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-accent cursor-pointer"
                        >
                            <FiArrowLeft size={16} />
                            Back to jobs
                        </button>

                        <p className="text-sm font-medium text-accent">{job.companyName}</p>

                        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl md:text-5xl">
                            {job.jobTitle}
                        </h1>

                        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
                            <span className="inline-flex items-center gap-1.5">
                                <FiMapPin size={14} className="text-accent" />
                                {job.jobLocation}
                            </span>
                            <span className="rounded-md border border-accent/20 bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">
                                {job.jobLocationType}
                            </span>
                            <span className="rounded-md border border-border bg-surface px-2 py-0.5 text-xs font-medium text-ink">
                                {job.jobType}
                            </span>
                            {job.jobCategory && (
                                <span className="inline-flex items-center gap-1.5">
                                    <FiBriefcase size={14} />
                                    {job.jobCategory}
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1.5">
                                <FiClock size={14} />
                                Posted {formatDate(job.createdAt)}
                            </span>
                        </div>

                        {(job.minSalary > 0 || job.maxSalary > 0) && (
                            <p className="mt-4 text-lg font-semibold text-success">
                                {formatSalary(
                                    job.minSalary,
                                    job.maxSalary,
                                    job.salaryCurrency,
                                    job.salaryType
                                )}
                            </p>
                        )}

                        {/* One CTA group */}
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                disabled
                                title="Apply comes in a later session"
                                className="rounded-lg bg-accent/50 px-6 py-3 text-sm font-semibold text-white cursor-not-allowed"
                            >
                                Apply
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    detailsRef.current?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                    })
                                }
                                className="rounded-lg border border-border bg-surface px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent cursor-pointer"
                            >
                                View details
                            </button>
                            <button
                                type="button"
                                onClick={handleShare}
                                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent cursor-pointer"
                            >
                                <FiShare2 size={16} />
                                Share
                            </button>
                            {shareHint && (
                                <span className="text-xs font-medium text-accent">
                                    {shareHint}
                                </span>
                            )}
                        </div>

                        {loading && (
                            <p className="mt-4 text-xs text-muted">Refreshing from server…</p>
                        )}
                    </div>
                </section>

                {/* Details below fold — single column, not a card dashboard */}
                <section
                    ref={detailsRef}
                    className="mx-auto max-w-3xl space-y-10 px-4 py-12 sm:px-6"
                >
                    <div>
                        <h2 className="font-display text-xl font-semibold text-ink">
                            About this role
                        </h2>
                        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted sm:text-base">
                            {job.jobDescription || "No description provided."}
                        </p>
                    </div>

                    {responsibilities.length > 0 && (
                        <div>
                            <h2 className="font-display text-xl font-semibold text-ink">
                                Responsibilities
                            </h2>
                            <ul className="mt-4 space-y-2.5">
                                {responsibilities.map((item) => (
                                    <li
                                        key={item}
                                        className="flex gap-3 text-sm leading-relaxed text-muted sm:text-base"
                                    >
                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {requirements.length > 0 && (
                        <div>
                            <h2 className="font-display text-xl font-semibold text-ink">
                                Requirements
                            </h2>
                            <ul className="mt-4 space-y-2.5">
                                {requirements.map((item) => (
                                    <li
                                        key={item}
                                        className="flex gap-3 text-sm leading-relaxed text-muted sm:text-base"
                                    >
                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {job.jobSkills?.length > 0 && (
                        <div>
                            <h2 className="font-display text-xl font-semibold text-ink">
                                Skills
                            </h2>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {job.jobSkills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="border-t border-border pt-6 text-sm text-muted">
                        <p>
                            {job.companyName}
                            {job.companyLocation ? ` · ${job.companyLocation}` : ""}
                        </p>
                        {job.expireAt && (
                            <p className="mt-1">Expires {formatDate(job.expireAt)}</p>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
};

export default JobDetails;
