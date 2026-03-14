import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";

export interface AuthRequest extends Request {
    user?: { _id: string; role: string }
}

const Protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log("🔍 ALL COOKIES:", req.cookies);
    console.log("🔍 TOKEN:", req.cookies?.token);

    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized. No token provided." })
        }

        // 👇 BUG FIX: Login uses 'id', middleware was using decoded.id
        const decoded = jwt.verify(token, process.env.JWT_TOKEN!) as { id: string; role: string };

        // 👇 CHANGE THIS LINE:
        const user = await UserModel.findById(decoded.id);
        // WAS: decoded.id (but login signs { id: user._id })

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found." })
        }

        req.user = { _id: user._id.toString(), role: user.role }
        next()
    } catch (error) {
        console.log("❌ JWT ERROR:", error);  // 👈 ADD THIS
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