import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    role: "jobseeker" | "employer",
    fullname: string,
    phone: string,
    gender: "male" | "female" | "custom",
    location: string,
    bio: string,
    domain: string,
    isProfileCompleted: boolean
}

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            maxlength: 15,
            minlength: 7,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            trim: true
        },
        role: {
            type: String,
            enum: ["jobseeker", "employer"],
            default: "jobseeker"
        },
        fullname: {
            type: String,
            trim: true
        },
        gender: {
            type: String,
            enum: ["male", "female", "custom"],
            default: "male",
        },
        phone: {
            type: String,
        },
        location: {
            type: String,
        },
        bio: {
            type: String,
            minlength: 100,
            maxlength: 1500
        },
        domain: {
            type: String,
        },
        isProfileCompleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model<IUser>("User", UserSchema);