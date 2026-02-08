const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); // Forces Google and Cloudflare DNS

import express from "express";
import ConnectDatabase from "./config/database";
import dotenv from "dotenv";
import UserRouter from "./routes/UserRoute";
import cors from "cors";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT;
const app = express();
dotenv.config();

// call database connection function
app.use(cors());
app.use(express.json());
app.use(cookieParser());
ConnectDatabase();

// call User Routes
app.use("/api/auth", UserRouter);

// listen to port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})