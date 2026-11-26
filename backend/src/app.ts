import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import ConnectDatabase from "./config/database";
import UserRouter from "./routes/UserRoute";
import JobRouter from "./routes/JobRoute";

dotenv.config();

const app = express();

const allowedOrigins = (
    process.env.CLIENT_URL || "http://localhost:5173"
)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            // Allow same-origin / non-browser / local tooling with no Origin header
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

void ConnectDatabase();

app.get("/api/health", (_req, res) => {
    res.status(200).json({ success: true, message: "DevHunt API is healthy" });
});

app.use("/api/auth", UserRouter);
app.use("/api/job", JobRouter);

export default app;
