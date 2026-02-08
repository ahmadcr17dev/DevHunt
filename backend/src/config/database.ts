import mongoose from "mongoose";
import dotenv from "dotenv";

// initialized Dotenv
dotenv.config();

// function to connect to database
const ConnectDatabase = async() => {
    try {
        const db_connect = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB Connect: ${db_connect.connection.host}`);
    } catch (error) {
        console.error("Error: ", error);
    }
}

export default ConnectDatabase;