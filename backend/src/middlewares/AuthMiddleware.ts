import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";

export interface AuthRequest extends Request {
    user?: { _id: string; role: string }
}

const Protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split("")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized. No token provided" });
        }
        const decode = jwt.verify(token, process.env.JWT_TOKEN!) as { _id: string };
        const user = await UserModel.findById(decode._id).select("-password");
        if (!user) {
            return res.status(401).json({ success: false, message: "user not found" });
        }
        req.user = { _id: user._id.toString(), role: user.role };
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid or expired token." })
    }
}

const EmployerOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== "employer") {
        return res.status(403).json({ success: false, message: "Access Denied. Employers Only" });
    }
    next();
}

export { Protect, EmployerOnly };