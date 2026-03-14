import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

interface JobFormData {
    jobTitle: string
    companyName: string
    companyLocation: string
    jobType: "Full Time" | "Part Time" | "Contract" | "Internship" | "Temporary" | "Fresher"
    jobLocation: string
    jobLocationType: "Remote" | "Onsite" | "Hybrid"
    jobDescription: string
    jobResponsibilities: string
    jobRequirements: string
    jobSkills: string // comma-separated input, split on submit
    jobCategory: string
    minSalary: string
    maxSalary: string
    salaryCurrency: string
    expireAt: string
}

interface FieldError {
    field: string
    message: string
}

const FIELD_CLASS =
    "w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"

const LABEL_CLASS = "block text-sm font-semibold text-slate-300 mb-2"

const PostJob = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<FieldError[]>([])
    const [globalError, setGlobalError] = useState("")
    const [success, setSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState<JobFormData>({
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
        expireAt: "",
    })

    const getFieldError = (field: string) =>
        errors.find((e) => e.field === field)?.message

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        // clear field error on change
        setErrors((prev) => prev.filter((e) => e.field !== name))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrors([])
        setGlobalError("")
        setSuccess(null)

        try {
            const response = await axios.post(import.meta.env.VITE_CREATE_JOB_KEY as string, {
                ...formData,
                jobSkills: formData.jobSkills.split(",").map((s) => s.trim()).filter(Boolean),
                minSalary: Number(formData.minSalary),
                maxSalary: Number(formData.maxSalary),
                expireAt: new Date(formData.expireAt).toISOString(),
            }, {
                withCredentials: true
            })
            setTimeout(() => {
                setSuccess(response.data.message);
            }, 1500)
            setFormData({
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
                expireAt: "",
            })
        } catch (err: any) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors)
            } else {
                setGlobalError(err.response?.data?.message || "Something went wrong. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Background with gradient */}
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8">

                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-4xl mx-auto relative z-10">
                    {/* Header */}
                    <div className="mb-10 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Post a Job</h2>
                        <p className="text-slate-400 text-base">Fill in the details to publish your job listing.</p>
                    </div>

                    {globalError && (
                        <div className="mb-8 px-6 py-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {globalError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Basic Info */}
                        <Section title="Basic Information">
                            <Field label="Job Title" error={getFieldError("jobTitle")}>
                                <input
                                    name="jobTitle"
                                    placeholder="e.g. Senior React Developer"
                                    className={FIELD_CLASS}
                                    value={formData.jobTitle}
                                    onChange={handleChange}
                                    required
                                />
                            </Field>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Company Name" error={getFieldError("companyName")}>
                                    <input
                                        name="companyName"
                                        placeholder="e.g. Acme Corp"
                                        className={FIELD_CLASS}
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Field>
                                <Field label="Company Location" error={getFieldError("companyLocation")}>
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

                            <Field label="Job Category" error={getFieldError("jobCategory")}>
                                <select
                                    name="jobCategory"
                                    value={formData.jobCategory}
                                    onChange={handleChange}
                                    className={FIELD_CLASS}
                                    required
                                >
                                    <option value="">Select Job Category</option>
                                    <option value="Information Technology">Information Technology</option>
                                    <option value="Design & Creative">Design & Creative</option>
                                    <option value="Marketing & Sales">Marketing & Sales</option>
                                    <option value="Business & Management">Business & Management</option>
                                    <option value="Finance & Admin">Finance & Admin</option>
                                    <option value="Human Resources">Human Resources</option>
                                    <option value="Customer Service">Customer Service</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Education">Education</option>
                                    <option value="Legal">Legal</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Sales & Business Development">Sales & Business Development</option>
                                    <option value="Operations">Operations</option>
                                    <option value="Research & Development">Research & Development</option>
                                    <option value="Media & Communications">Media & Communications</option>
                                </select>
                            </Field>
                        </Section>

                        {/* Job Type & Location */}
                        <Section title="Job Type & Location">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Job Type" error={getFieldError("jobType")}>
                                    <select
                                        name="jobType"
                                        className={FIELD_CLASS}
                                        value={formData.jobType}
                                        onChange={handleChange}
                                    >
                                        {["Full Time", "Part Time", "Contract", "Internship", "Temporary", "Fresher"].map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label="Location Type" error={getFieldError("jobLocationType")}>
                                    <select
                                        name="jobLocationType"
                                        className={FIELD_CLASS}
                                        value={formData.jobLocationType}
                                        onChange={handleChange}
                                    >
                                        {["Remote", "Onsite", "Hybrid"].map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </Field>
                            </div>

                            <Field label="Job Location" error={getFieldError("jobLocation")}>
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

                        {/* Salary */}
                        <Section title="Salary Information">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <Field label="Min Salary" error={getFieldError("minSalary")}>
                                    <input
                                        name="minSalary"
                                        type="number"
                                        placeholder="e.g. 50000"
                                        className={FIELD_CLASS}
                                        value={formData.minSalary}
                                        onChange={handleChange}
                                        required
                                    />
                                </Field>
                                <Field label="Max Salary" error={getFieldError("maxSalary")}>
                                    <input
                                        name="maxSalary"
                                        type="number"
                                        placeholder="e.g. 90000"
                                        className={FIELD_CLASS}
                                        value={formData.maxSalary}
                                        onChange={handleChange}
                                        required
                                    />
                                </Field>
                                <Field label="Currency" error={getFieldError("salaryCurrency")}>
                                    <select
                                        name="salaryCurrency"
                                        className={FIELD_CLASS}
                                        value={formData.salaryCurrency}
                                        onChange={handleChange}
                                    >
                                        {["USD", "EUR", "GBP", "PKR", "INR", "AED"].map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </Field>
                            </div>
                        </Section>

                        {/* Details */}
                        <Section title="Job Details">
                            <Field label="Skills (comma-separated)" error={getFieldError("jobSkills")}>
                                <input
                                    name="jobSkills"
                                    placeholder="e.g. React, Node.js, MongoDB"
                                    className={FIELD_CLASS}
                                    value={formData.jobSkills}
                                    onChange={handleChange}
                                    required
                                />
                            </Field>

                            <Field label="Job Description" error={getFieldError("jobDescription")}>
                                <textarea
                                    name="jobDescription"
                                    placeholder="Describe the role, team, and what success looks like..."
                                    rows={5}
                                    className={FIELD_CLASS}
                                    value={formData.jobDescription}
                                    onChange={handleChange}
                                    required
                                />
                            </Field>

                            <Field label="Responsibilities" error={getFieldError("jobResponsibilities")}>
                                <textarea
                                    name="jobResponsibilities"
                                    placeholder="List the key responsibilities for this role..."
                                    rows={4}
                                    className={FIELD_CLASS}
                                    value={formData.jobResponsibilities}
                                    onChange={handleChange}
                                    required
                                />
                            </Field>

                            <Field label="Requirements" error={getFieldError("jobRequirements")}>
                                <textarea
                                    name="jobRequirements"
                                    placeholder="List the required qualifications and experience..."
                                    rows={4}
                                    className={FIELD_CLASS}
                                    value={formData.jobRequirements}
                                    onChange={handleChange}
                                    required
                                />
                            </Field>
                        </Section>

                        {/* Expiry */}
                        <Section title="Listing Expiry">
                            <Field label="Expire At" error={getFieldError("expireAt")}>
                                <input
                                    name="expireAt"
                                    type="date"
                                    className={FIELD_CLASS}
                                    value={formData.expireAt}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split("T")[0]}
                                    required
                                />
                            </Field>
                        </Section>

                        {/* {Success Messages */}
                        {success && (
                            <div className="md:col-span-2 p-4 bg-green-50 border border-green-200 rounded-xl">
                                <p className="text-green-600 text-sm font-medium">{success}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-xl font-semibold text-white text-sm transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 flex items-center justify-center gap-2 hover:cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Posting...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Post Job
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all duration-300 hover:cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

// ── Helpers ──────────────────────────────────────────────

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-slate-600/50 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">{title}</h3>
        </div>
        {children}
    </div>
)

const Field = ({
    label,
    error,
    children,
}: {
    label: string
    error?: string
    children: React.ReactNode
}) => (
    <div>
        <label className={LABEL_CLASS}>{label}</label>
        {children}
        {error && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">{error}</p>}
    </div>
)

export default PostJob;