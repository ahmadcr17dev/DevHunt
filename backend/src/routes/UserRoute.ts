import express from "express";
import { register, login, logout, ProfileCompleted, profileData } from "../controllers/UserController";
import { CreateJob, DeleteJob, GetAllJobs, GetJobsByID, GetMyJobs, ToggleJobStatus, UpdateJob } from "../controllers/JobController";
import { Protect, EmployerOnly } from "../middlewares/AuthMiddleware";

const UserRouter = express.Router();

// call register & login route & other user routes
UserRouter.post("/register", register);
UserRouter.post("/login", login);
UserRouter.post("/logout", logout);
UserRouter.put("/profilecompleted", ProfileCompleted);
UserRouter.get("/profile", profileData);

// call job routes
UserRouter.use(Protect, EmployerOnly);
UserRouter.post("/createjob", CreateJob);
UserRouter.get("/getalljobs", GetAllJobs);
UserRouter.get("/getjobsbyid/:id", GetJobsByID);
UserRouter.get("/getmyjobs", GetMyJobs);
UserRouter.patch("/updatejob/:id", UpdateJob);
UserRouter.delete("/deletejob/:id", DeleteJob);
UserRouter.patch("/togglejobstatus/:id", ToggleJobStatus);

export default UserRouter;