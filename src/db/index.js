import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
// while importing extension of files is imp to give

// * APPROACH 2: writing db code even in db folder separately
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        // The await waits until the connection happens (or fails).

        // mongoose gives a return object which we can store in a variable

        // the response after successful connection is held in connectionInstance variable.It stores the result of the connection inside connectionInstance.

        // This object contains details like the host name, ready state, DB name, etc.

        /*If the connection is successful, it prints the host name of the MongoDB server.
        It helps you verify which server you’re connected to.
        Example output:
        "cluster0.mongodb.net" */
        console.log(`\n MongoDB connected !! DB HOST:${connectionInstance.connection.host}`);
    } catch (e) {
        console.log("mongodb connection FAILED: ", e);
        process.exit(1); //process exited with error
    }
}
export default connectDB;