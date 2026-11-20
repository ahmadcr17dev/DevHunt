import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

declare global {
    var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = cached;

const ConnectDatabase = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("Error: MONGO_URI is not defined");
        return;
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(uri).then((connection) => {
            console.log(`MongoDB Connect: ${connection.connection.host}`);
            return connection;
        });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        console.error("Error: ", error);
    }
};

export default ConnectDatabase;
