import mongoose, { Schema } from "mongoose";

interface ISavedJob extends Document {
    user: mongoose.Types.ObjectId;
    job: mongoose.Types.ObjectId;
    savedAt: Date;
}

const SavedJobSchema = new Schema<ISavedJob>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    savedAt: {
        type: Date,
        default: Date.now
    },
},
    {
        timestamps: true
    });

export default mongoose.model<ISavedJob>('SavedJob', SavedJobSchema);