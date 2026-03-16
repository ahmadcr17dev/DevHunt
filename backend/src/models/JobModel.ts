import mongoose, { Document, Schema } from "mongoose"

export interface IJob extends Document {
    jobTitle: string
    companyName: string
    companyLocation: string
    jobType: | "Full Time" | "Part Time" | "Contract" | "Internship" | "Temporary" | "Fresher"
    jobLocation: string
    jobLocationType: "Remote" | "Onsite" | "Hybrid"
    jobDescription: string
    jobResponsibilities: string
    jobRequirements: string
    jobSkills: string[]
    jobCategory: string
    minSalary: number
    maxSalary: number
    salaryCurrency: string
    expireAt: Date
    status: "active" | "closed"

    employer: mongoose.Types.ObjectId
}

const JobSchema = new Schema<IJob>(
    {
        jobTitle: {
            type: String,
            required: true,
            trim: true,
        },

        companyName: {
            type: String,
            required: true,
            trim: true,
        },

        companyLocation: {
            type: String,
            required: true,
            trim: true,
        },

        jobType: {
            type: String,
            required: true,
            enum: [
                "Full Time",
                "Part Time",
                "Contract",
                "Internship",
                "Temporary",
                "Fresher",
            ],
        },

        jobLocation: {
            type: String,
            required: true,
            trim: true,
        },

        jobLocationType: {
            type: String,
            enum: ["Remote", "Onsite", "Hybrid"],
            required: true,
        },

        jobDescription: {
            type: String,
            required: true,
        },

        jobResponsibilities: {
            type: String,
            required: true,
        },

        jobRequirements: {
            type: String,
            required: true,
        },

        jobSkills: {
            type: [String],
            required: true,
        },

        jobCategory: {
            type: String,
            required: true,
        },

        minSalary: {
            type: Number,
            required: true,
        },

        maxSalary: {
            type: Number,
            required: true,
        },

        salaryCurrency: {
            type: String,
            default: "USD",
        },

        expireAt: {
            type: Date,
            required: true,
            // index: { expires: "0s" }, // auto-delete after expiry
        },

        status: {
            type: String,
            enum: ["active", "closed"],
            default: "active",
        },

        employer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

export default mongoose.model<IJob>("Job", JobSchema);