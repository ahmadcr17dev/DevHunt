import express from "express";
import { register, login, logout, ProfileCompleted, profileData } from "../controllers/UserController";
import { Protect } from "../middlewares/AuthMiddleware";

const UserRouter = express.Router();

// call register & login route & other user routes
UserRouter.post("/register", register);
UserRouter.post("/login", login);
UserRouter.post("/logout", Protect, logout);
UserRouter.put("/profilecompleted", Protect, ProfileCompleted);
UserRouter.get("/profile", Protect, profileData);

export default UserRouter;