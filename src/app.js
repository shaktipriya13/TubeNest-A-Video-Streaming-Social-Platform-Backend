import mongoose from "mongoose";
import { DB_NAME } from "./constants";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`${connectionInstance.connection.host}`);
    } catch (e) {
        console.log("erroer:", e);
        process.exit(1);
    }
}