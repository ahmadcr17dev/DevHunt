import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        // check all fields are filled
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // check username already existed
        const UsernameExists = await UserModel.findOne({ username });
        if (UsernameExists) {
            return res.status(400).json({ success: false, message: "Username already existed" });
        }

        // check user already registered
        const EmailExists = await UserModel.findOne({ email });
        if (EmailExists) {
            return res.status(400).json({ success: false, message: "Email already existed" });
        }

        // Hash password 
        const HashPassword = await bcrypt.hash(password, 10);

        // store user
        const user = await UserModel.create({
            username,
            email,
            password: HashPassword
        });

        // send response on sign up
        res.status(201).json({
            success: true,
            message: "Registration Successfull",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isProfileCompleted: user.isProfileCompleted
            }
        })

    } catch (error) {
        console.log("Error", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // all fields are required
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // check username is registered
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, message: "Username not registered" });
        }

        // compare password
        const MatchPassword = await bcrypt.compare(password, user.password);
        if (!MatchPassword) {
            return res.status(400).json({ success: false, message: "Password not matched" });
        }

        // create token
        const token = Jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_TOKEN!, { expiresIn: "7d" }
        )

        // send response on login
        res.status(200).json({
            success: true,
            message: "Login Successfull",
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isProfileCompleted: user.isProfileCompleted
            }
        })

    } catch (error) {
        console.log("Error", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const logout = async (res: Response) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({ success: true, message: "LogOut Successfull" });
    } catch (error) {
        console.log("Error", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// function for profile completion
const ProfileCompleted = async (req: Request, res: Response) => {
    try {
        // Get userId from request body (since we don't have auth middleware)
        const { userId, username, fullname, phone, gender, location, domain, bio } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // Update user data
        const user = await UserModel.findByIdAndUpdate(
            userId,
            {
                username,
                fullname,
                phone,
                gender,
                location,
                domain,
                bio,
                isProfileCompleted: true, // mark profile as completed
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Profile Completed Successfully",
            user
        });
    } catch (error) {
        console.error("ProfileCompleted Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const profileData = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const user = await UserModel.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export { register, login, logout, ProfileCompleted, profileData };