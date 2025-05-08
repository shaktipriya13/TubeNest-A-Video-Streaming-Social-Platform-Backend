// require('dotenv').config({ path: './env' }) : this code will run but not consistent with code practices

// * APPROACH 2: writing db code even in db folder separately
import dotenv from "dotenv";
dotenv.config({ path: './env' })
import connectDB from "./db/index.js";

connectDB();



// * APPROACH 1: writing db code even in index.js
/*
import express from 'express'
const app = express();
//1st approach
// function connectDB(){}
// connectDB();

// 2nd approach :IIfe 
// the ; in begin is only for cleaning purpose
; (async () => {
    // async is used bcoz db is in another continent
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        // jis db se connect krna ha uska nam bhi use krna ha

        app.on("error", () => {

            console.log("error occured", error);
            throw error

            // The app.on("error", ...) event listener is used to catch and handle errors that occur in the Express application itself after the database connection is established.
        })
        app.listen(process.env.PORT, () => {
            console.log(`app is listening on port- ${process.env.PORT}`);
        })
    } catch (e) {
        console.error('erroe occurred:', e);
        throw e
        // console.log() is same as console.error
    }
})()
*/