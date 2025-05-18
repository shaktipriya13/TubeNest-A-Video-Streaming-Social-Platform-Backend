// // require('dotenv').config({ path: './env' }) : this code will run but not consistent with code practices

// // * APPROACH 2: writing db code even in db folder separately
// import dotenv from "dotenv";
// dotenv.config({ path: './.env' }) //it seraches for .env file by default. good practice to provide the path
// import connectDB from "./db/index.js";
// import { app } from "./app.js";

// // when an asynchronus mthd is completed then a promise is also returned  
// const port = process.env.PORT || 5000;
// connectDB()  //promise
//     .then(() => {
//         // app.listen: it happens if connection to db connects successfully
//         // Start server only after DB connects
//         const server = app.listen(port, () => {
//             console.log(`Server is listening at port ${port}`);
//         });

//         // Listen for errors on the server
//         // This is a solid practice.It ensures any unexpected server issues(e.g., port conflict) are logged clearly.
//         server.on("error", (err) => {
//             console.log("Server error:", err);
//             throw err;
//         });
//     })
//     .catch((e) => {
//         console.error('mondoDB connect failed:', e);
//     })

// console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
// console.log("ACCESS_TOKEN_EXPIRY:", process.env.ACCESS_TOKEN_EXPIRY);
// console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);
// console.log("REFRESH_TOKEN_EXPIRY:", process.env.REFRESH_TOKEN_EXPIRY);

// // * APPROACH 1: writing db code even in index.js
// /*
// import express from 'express'
// const app = express();
// //1st approach
// // function connectDB(){}
// // connectDB();

// // 2nd approach :IIfe 
// // the ; in begin is only for cleaning purpose
// ; (async () => {
//     // async is used bcoz db is in another continent
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         // jis db se connect krna ha uska nam bhi use krna ha

//         app.on("error", () => {

//             console.log("error occured", error);
//             throw error

//             // The app.on("error", ...) event listener is used to catch and handle errors that occur in the Express application itself after the database connection is established.
//         })
//         app.listen(process.env.PORT, () => {
//             console.log(`app is listening on port- ${process.env.PORT}`);
//         })
//     } catch (e) {
//         console.error('error occurred:', e);
//         throw e
//         // console.log() is same as console.error
//     }
// })()
// */



import dotenv from "dotenv";
dotenv.config({ path: './.env' });

import connectDB from "./db/index.js";
import { app } from "./app.js";

// Validate required environment variables
const requiredEnvVars = [
    'MONGODB_URI',
    'PORT',
    'ACCESS_TOKEN_SECRET',
    'ACCESS_TOKEN_EXPIRY',
    'REFRESH_TOKEN_SECRET',
    'REFRESH_TOKEN_EXPIRY'
];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    process.exit(1);
}

const port = process.env.PORT || 8000; // Align with previous tests

connectDB()
    .then(() => {
        const server = app.listen(port, () => {
            console.log(`Server is listening at port ${port}`);
        });

        // Handle server errors (e.g., port conflict)
        server.on("error", (err) => {
            console.error("Server error:", err);
            process.exit(1); // Exit with failure status
        });

        // Graceful shutdown on termination signals
        const shutdown = () => {
            console.log("Shutting down server...");
            server.close(() => {
                console.log("Server closed.");
                process.exit(0);
            });
        };

        process.on("SIGTERM", shutdown);
        process.on("SIGINT", shutdown);
    })
    .catch((e) => {
        console.error('MongoDB connection failed:', e);
        process.exit(1);
    });