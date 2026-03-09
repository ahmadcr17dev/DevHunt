import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

interface JobFormData {
    title: string
    type: "full-time" | "part-time" | "contract" | "internship"
    location: string
    remote: boolean
    experience: string
    salaryMin: string
    salaryMax: string
    skills: string
    description: string
}

const PostJob = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState<JobFormData>({
        title: "",
        type: "full-time",
        location: "",
        remote: false,
        experience: "",
        salaryMin: "",
        salaryMax: "",
        skills: "",
        description: "",
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await axios.post("/jobs", {
                ...formData,
                skills: formData.skills.split(",").map((s) => s.trim()),
            })

            navigate("/employer/jobs", { replace: true })
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold mb-6">Post a Job</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <input
                    name="title"
                    placeholder="Job Title"
                    className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <select name="type" className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3" onChange={handleChange}>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                </select>

                <input
                    name="location"
                    placeholder="Location (e.g. Remote / NYC)"
                    className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3"
                    value={formData.location}
                    onChange={handleChange}
                />

                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        name="remote"
                        checked={formData.remote}
                        onChange={handleChange}
                    />
                    Remote allowed
                </label>

                <input
                    name="experience"
                    placeholder="Experience (e.g. 2+ years)"
                    className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3"
                    value={formData.experience}
                    onChange={handleChange}
                />

                <div className="flex gap-4">
                    <input
                        name="salaryMin"
                        placeholder="Salary Min"
                        className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3"
                        value={formData.salaryMin}
                        onChange={handleChange}
                    />
                    <input
                        name="salaryMax"
                        placeholder="Salary Max"
                        className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3"
                        value={formData.salaryMax}
                        onChange={handleChange}
                    />
                </div>

                <input
                    name="skills"
                    placeholder="Skills (React, Node, MongoDB)"
                    className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3"
                    value={formData.skills}
                    onChange={handleChange}
                />

                <textarea
                    name="description"
                    placeholder="Job Description"
                    rows={6}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3"
                    value={formData.description}
                    onChange={handleChange}
                />

                <button
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-medium"
                >
                    {loading ? "Posting..." : "Post Job"}
                </button>
            </form>
        </div>
    )
}

export default PostJob;