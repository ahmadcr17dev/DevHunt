import express from "express";
import { register, login, logout, ProfileCompleted, profileData } from "../controllers/UserController";

const UserRouter = express.Router();

// call register & login route
UserRouter.post("/register", register);
UserRouter.post("/login", login);
UserRouter.post("/logout", logout);
UserRouter.put("/profilecompleted", ProfileCompleted);
UserRouter.get("/profile", profileData);

export default UserRouter;