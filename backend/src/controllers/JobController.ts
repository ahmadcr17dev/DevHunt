import { Response } from "express";
import JobModel from "../models/JobModel";
import { AuthRequest } from "../middlewares/AuthMiddleware";

const HandleMongooseError = async (err: any, res: Response) => {
    if (err.name === "ValidateError") {
        const errors = Object.values(err.errors).map((e: any) => ({
            field: e.path,
            message: e.message
        }))
        return res.status(400).json({ message: "Validation failed", errors })
    }
    if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid ID format" })
    }
    return res.status(500).json({ message: "Server Error", error: err.message })
}

const CreateJob = async (req: AuthRequest, res: Response) => {
    try {
        const job = await JobModel.create({ ...req.body, employer: req.user!._id })
        return res.status(201).json({ success: true, message: "Job Created Successfully", job })
    } catch (err: any) {
        HandleMongooseError(err, res);
    }
}

const GetAllJobs = async (req: AuthRequest, res: Response) => {
    try {
        const query: Record<string, unknown> = {
            status: "active",
            expireAt: { $gte: new Date() } // only non-expired jobs will be fetched
        };
        const { search, jobType, jobLocationType, jobCategory } = req.query;

        // Build the same query for both count and find
        if (search) {
            query.$or = [
                { jobTitle: { $regex: search as string, $options: "i" } },
                { companyName: { $regex: search as string, $options: "i" } },
                { jobLocation: { $regex: search as string, $options: "i" } }
            ];
        }
        if (jobType) query.jobType = jobType;
        if (jobLocationType) query.jobLocationType = jobLocationType;
        if (jobCategory) query.jobCategory = jobCategory;

        // 🔥 EFFICIENT: Get count and jobs in parallel
        const [jobs, total] = await Promise.all([
            JobModel.find(query)
                .populate("employer", "name email")
                .sort({ createdAt: -1 }),
            JobModel.countDocuments(query) // ✅ Fast count without fetching documents
        ]);

        res.status(200).json({
            success: true,
            jobs,
            total, // ✅ Accurate total count
            filtersApplied: {
                search: search || null,
                jobType: jobType || null,
                jobLocationType: jobLocationType || null,
                jobCategory: jobCategory || null
            }
        });
    } catch (err: any) {
        console.error('GetAllJobs Error:', err);
        HandleMongooseError(err, res);
    }
};

const GetMyJobs = async (req: AuthRequest, res: Response) => {
    try {
        const jobs = await JobModel.find({ employer: req.user!._id }).sort({ createdAt: -1 })
        res.status(200).json({ jobs })
    } catch (err: any) {
        HandleMongooseError(err, res);
    }
}

const GetJobsByID = async (req: AuthRequest, res: Response) => {
    try {
        const job = await JobModel.findById(req.params.id).populate("employer", "name email");
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }
        res.status(200).json({ job });
    } catch (err: any) {
        HandleMongooseError(err, res);
    }
}

const UpdateJob = async (req: AuthRequest, res: Response) => {
    try {
        const job = await JobModel.findOne({ _id: req.params.id, employer: req.user!._id })
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found or unauthorized" });
        }
        Object.assign(job, req.body);
        await job.save();
        res.status(200).json({ success: true, message: "Job Updated", job })
    } catch (err: any) {
        HandleMongooseError(err, res);
    }
}

const DeleteJob = async (req: AuthRequest, res: Response) => {
    try {
        const job = await JobModel.findOneAndDelete({ _id: req.params.id, employer: req.user!._id })
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found or Unauthorised" });
        }
        res.status(200).json({ success: true, message: "Job Deleted" });
    } catch (err: any) {
        HandleMongooseError(err, res);
    }
}

const ToggleJobStatus = async (req: AuthRequest, res: Response) => {
    try {
        const job = await JobModel.findOne({ _id: req.params.id, employer: req.user!._id })
        if (!job) return res.status(404).json({ message: "Job not found or unauthorized." })

        job.status = job.status === "active" ? "closed" : "active"
        await job.save()
        res.status(200).json({ message: `Job is now ${job.status}.`, job })
    } catch (err: any) {
        HandleMongooseError(err, res)
    }
}

export { HandleMongooseError, CreateJob, GetAllJobs, GetMyJobs, GetJobsByID, UpdateJob, DeleteJob, ToggleJobStatus };