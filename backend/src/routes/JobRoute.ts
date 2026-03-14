import express from "express";
import { CreateJob, DeleteJob, GetAllJobs, GetJobsByID, GetMyJobs, ToggleJobStatus, UpdateJob } from "../controllers/JobController";
import { Protect, EmployerOnly } from "../middlewares/AuthMiddleware";

const JobRouter = express.Router();

// call job routes
JobRouter.post("/createjob", Protect, EmployerOnly, CreateJob);
JobRouter.get("/getalljobs", GetAllJobs);
JobRouter.get("/getjobsbyid/:id", GetJobsByID);
JobRouter.get("/getmyjobs", GetMyJobs);
JobRouter.patch("/updatejob/:id", UpdateJob);
JobRouter.delete("/deletejob/:id", DeleteJob);
JobRouter.patch("/togglejobstatus/:id", ToggleJobStatus);

export default JobRouter;