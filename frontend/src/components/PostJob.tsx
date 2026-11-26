import { useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import worldCurrencies from "world-currencies";
import { API } from "../config/api";
import { useAuth } from "../context/AuthContext";

interface JobFormData {
    jobTitle: string;
    companyName: string;
    companyLocation: string;
    jobType:
        | "Full Time"
        | "Part Time"
        | "Contract"
        | "Internship"
        | "Temporary"
        | "Fresher";
    jobLocation: string;
    jobLocationType: "Remote" | "Onsite" | "Hybrid";
    jobDescription: string;
    jobResponsibilities: string;
    jobRequirements: string;
    jobSkills: string;
    jobCategory: string;
    minSalary: string;
    maxSalary: string;
    salaryCurrency: string;
    salaryType: "Hourly" | "Monthly" | "Yearly";
    expireAt: string;
}

interface FieldError {
    field: string;
    message: string;
}

const FIELD_CLASS =
    "w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors focus:border-accent";

const LABEL_CLASS = "mb-2 block text-sm font-medium text-ink";

const EMPTY_FORM: JobFormData = {
    jobTitle: "",
    companyName: "",
    companyLocation: "",
    jobType: "Full Time",
    jobLocation: "",
    jobLocationType: "Onsite",
    jobDescription: "",
    jobResponsibilities: "",
    jobRequirements: "",
    jobSkills: "",
    jobCategory: "",
    minSalary: "",
    maxSalary: "",
    salaryCurrency: "USD",
    salaryType: "Monthly",
    expireAt: "",
};

const MIN_EXPIRE_DATE = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split("T")[0];
})();

const PostJob = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<FieldError[]>([]);
    const [globalError, setGlobalError] = useState("");
    const [success, setSuccess] = useState<string | null>(null);
    const [formData, setFormData] = useState<JobFormData>(EMPTY_FORM);

    const currencyOptions = useMemo(() => {
        return Object.values(worldCurrencies).map((currency) => {
            const code = currency.iso.code;
            const countryCode = code.slice(0, 2).toUpperCase();
            const flag = countryCode
                .split("")
                .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
                .join("");
            return {
                value: code,
                label: `${flag} — ${code}`,
            };
        });
    }, []);

    const getFieldError = (field: string) =>
        errors.find((e) => e.field === field)?.message;

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => prev.filter((err) => err.field !== name));
        setGlobalError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors([]);
        setGlobalError("");
        setSuccess(null);

        if (user && user.role !== "employer") {
            setGlobalError(
                "Only employer accounts can post jobs. Complete your profile as an employer first."
            );
            setLoading(false);
            return;
        }

        const skills = formData.jobSkills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

        const minSalary = Number(formData.minSalary);
        const maxSalary = Number(formData.maxSalary);
        const localErrors: FieldError[] = [];

        if (!skills.length) {
            localErrors.push({
                field: "jobSkills",
                message: "Add at least one skill",
            });
        }
        if (Number.isNaN(minSalary) || minSalary < 0) {
            localErrors.push({
                field: "minSalary",
                message: "Enter a valid minimum salary",
            });
        }
        if (Number.isNaN(maxSalary) || maxSalary < 0) {
            localErrors.push({
                field: "maxSalary",
                message: "Enter a valid maximum salary",
            });
        }
        if (
            !Number.isNaN(minSalary) &&
            !Number.isNaN(maxSalary) &&
            maxSalary < minSalary
        ) {
            localErrors.push({
                field: "maxSalary",
                message: "Max salary must be greater than or equal to min",
            });
        }
        if (!formData.expireAt) {
            localErrors.push({
                field: "expireAt",
                message: "Expiry date is required",
            });
        }

        if (localErrors.length) {
            setErrors(localErrors);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                API.createJob,
                {
                    jobTitle: formData.jobTitle.trim(),
                    companyName: formData.companyName.trim(),
                    companyLocation: formData.companyLocation.trim(),
                    jobType: formData.jobType,
                    jobLocation: formData.jobLocation.trim(),
                    jobLocationType: formData.jobLocationType,
                    jobDescription: formData.jobDescription.trim(),
                    jobResponsibilities: formData.jobResponsibilities.trim(),
                    jobRequirements: formData.jobRequirements.trim(),
                    jobSkills: skills,
                    jobCategory: formData.jobCategory,
                    minSalary,
                    maxSalary,
                    salaryCurrency: formData.salaryCurrency,
                    salaryType: formData.salaryType,
                    expireAt: new Date(formData.expireAt).toISOString(),
                },
                { withCredentials: true }
            );

            setSuccess(
                response.data.message || "Job created successfully. Redirecting…"
            );
            setFormData(EMPTY_FORM);
            window.setTimeout(() => {
                navigate("/employer/updatejobs");
            }, 900);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const data = err.response?.data as
                    | { message?: string; errors?: FieldError[] }
                    | undefined;
                if (data?.errors?.length) {
                    setErrors(data.errors);
                } else {
                    const status = err.response?.status;
                    if (status === 401) {
                        setGlobalError("Please log in again to post a job.");
                    } else if (status === 403) {
                        setGlobalError(
                            data?.message ||
                                "Access denied. Employers only — set your role to employer in profile."
                        );
                    } else {
                        setGlobalError(
                            data?.message ||
                                "Something went wrong. Please try again."
                        );
                    }
                }
            } else {
                setGlobalError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <p className="text-sm font-medium text-accent">Employer</p>
                    <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                        Post a job
                    </h1>
                    <p className="mt-2 text-sm text-muted">
                        Publish a listing that job seekers can find on DevHunt.
                    </p>
                </div>

                {globalError && (
                    <div className="mb-6 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm font-medium text-warning">
                        {globalError}
                    </div>
                )}

                {success && (
                    <div className="mb-6 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Section title="Basic information">
                        <Field label="Job title" error={getFieldError("jobTitle")}>
                            <input
                                name="jobTitle"
                                placeholder="e.g. Senior React Developer"
                                className={FIELD_CLASS}
                                value={formData.jobTitle}
                                onChange={handleChange}
                                required
                            />
                        </Field>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field
                                label="Company name"
                                error={getFieldError("companyName")}
                            >
                                <input
                                    name="companyName"
                                    placeholder="e.g. Acme Corp"
                                    className={FIELD_CLASS}
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                />
                            </Field>
                            <Field
                                label="Company location"
                                error={getFieldError("companyLocation")}
                            >
                                <input
                                    name="companyLocation"
                                    placeholder="e.g. New York, USA"
                                    className={FIELD_CLASS}
                                    value={formData.companyLocation}
                                    onChange={handleChange}
                                    required
                                />
                            </Field>
                        </div>

                        <Field
                            label="Job category"
                            error={getFieldError("jobCategory")}
                        >
                            <select
                                name="jobCategory"
                                value={formData.jobCategory}
                                onChange={handleChange}
                                className={FIELD_CLASS}
                                required
                            >
                                <option value="">Select category</option>
                                <option value="Information Technology">
                                    Information Technology
                                </option>
                                <option value="Design & Creative">
                                    Design & Creative
                                </option>
                                <option value="Marketing & Sales">
                                    Marketing & Sales
                                </option>
                                <option value="Business & Management">
                                    Business & Management
                                </option>
                                <option value="Finance & Admin">Finance & Admin</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Education">Education</option>
                                <option value="Engineering">Engineering</option>
                            </select>
                        </Field>
                    </Section>

                    <Section title="Type & location">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Job type" error={getFieldError("jobType")}>
                                <select
                                    name="jobType"
                                    className={FIELD_CLASS}
                                    value={formData.jobType}
                                    onChange={handleChange}
                                >
                                    {[
                                        "Full Time",
                                        "Part Time",
                                        "Contract",
                                        "Internship",
                                        "Temporary",
                                        "Fresher",
                                    ].map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            <Field
                                label="Work type"
                                error={getFieldError("jobLocationType")}
                            >
                                <select
                                    name="jobLocationType"
                                    className={FIELD_CLASS}
                                    value={formData.jobLocationType}
                                    onChange={handleChange}
                                >
                                    {["Remote", "Onsite", "Hybrid"].map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        <Field
                            label="Job location"
                            error={getFieldError("jobLocation")}
                        >
                            <input
                                name="jobLocation"
                                placeholder="e.g. San Francisco, CA"
                                className={FIELD_CLASS}
                                value={formData.jobLocation}
                                onChange={handleChange}
                                required
                            />
                        </Field>
                    </Section>

                    <Section title="Salary">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field
                                label="Min salary"
                                error={getFieldError("minSalary")}
                            >
                                <input
                                    name="minSalary"
                                    type="number"
                                    min={0}
                                    placeholder="e.g. 50000"
                                    className={FIELD_CLASS}
                                    value={formData.minSalary}
                                    onChange={handleChange}
                                    required
                                />
                            </Field>
                            <Field
                                label="Max salary"
                                error={getFieldError("maxSalary")}
                            >
                                <input
                                    name="maxSalary"
                                    type="number"
                                    min={0}
                                    placeholder="e.g. 90000"
                                    className={FIELD_CLASS}
                                    value={formData.maxSalary}
                                    onChange={handleChange}
                                    required
                                />
                            </Field>
                            <Field
                                label="Currency"
                                error={getFieldError("salaryCurrency")}
                            >
                                <select
                                    name="salaryCurrency"
                                    className={FIELD_CLASS}
                                    value={formData.salaryCurrency}
                                    onChange={handleChange}
                                >
                                    {currencyOptions.map(({ value, label }) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field
                                label="Salary type"
                                error={getFieldError("salaryType")}
                            >
                                <select
                                    name="salaryType"
                                    className={FIELD_CLASS}
                                    value={formData.salaryType}
                                    onChange={handleChange}
                                >
                                    <option value="Hourly">Per hour</option>
                                    <option value="Monthly">Per month</option>
                                    <option value="Yearly">Per year</option>
                                </select>
                            </Field>
                        </div>
                    </Section>

                    <Section title="Job details">
                        <Field
                            label="Skills (comma-separated)"
                            error={getFieldError("jobSkills")}
                        >
                            <input
                                name="jobSkills"
                                placeholder="e.g. React, Node.js, MongoDB"
                                className={FIELD_CLASS}
                                value={formData.jobSkills}
                                onChange={handleChange}
                                required
                            />
                        </Field>

                        <Field
                            label="Description"
                            error={getFieldError("jobDescription")}
                        >
                            <textarea
                                name="jobDescription"
                                placeholder="Describe the role, team, and what success looks like…"
                                rows={5}
                                className={FIELD_CLASS}
                                value={formData.jobDescription}
                                onChange={handleChange}
                                required
                            />
                        </Field>

                        <Field
                            label="Responsibilities"
                            error={getFieldError("jobResponsibilities")}
                        >
                            <textarea
                                name="jobResponsibilities"
                                placeholder="One responsibility per line…"
                                rows={4}
                                className={FIELD_CLASS}
                                value={formData.jobResponsibilities}
                                onChange={handleChange}
                                required
                            />
                        </Field>

                        <Field
                            label="Requirements"
                            error={getFieldError("jobRequirements")}
                        >
                            <textarea
                                name="jobRequirements"
                                placeholder="One requirement per line…"
                                rows={4}
                                className={FIELD_CLASS}
                                value={formData.jobRequirements}
                                onChange={handleChange}
                                required
                            />
                        </Field>
                    </Section>

                    <Section title="Listing expiry">
                        <Field label="Expire at" error={getFieldError("expireAt")}>
                            <input
                                name="expireAt"
                                type="date"
                                className={FIELD_CLASS}
                                value={formData.expireAt}
                                onChange={handleChange}
                                min={MIN_EXPIRE_DATE}
                                required
                            />
                        </Field>
                        <p className="text-xs text-muted">
                            Only non-expired active jobs appear on /jobspage.
                        </p>
                    </Section>

                    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex flex-1 items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                        >
                            {loading ? "Posting…" : "Post job"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/employer")}
                            className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-6 py-3 text-sm font-semibold text-muted transition-colors hover:text-ink cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Section = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">{title}</h2>
        <div className="space-y-4">{children}</div>
    </section>
);

const Field = ({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) => (
    <div>
        <label className={LABEL_CLASS}>{label}</label>
        {children}
        {error && <p className="mt-1.5 text-xs font-medium text-warning">{error}</p>}
    </div>
);

export default PostJob;
