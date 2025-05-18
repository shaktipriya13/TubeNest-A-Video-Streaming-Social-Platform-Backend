// import express from 'express'
// import cookieParser from 'cookie-parser';
// import cors from 'cors'
// // the above 3 packages gets configured only after they become an app

// //* GROK:
// import fs from 'fs';

// // Ensure public/temp directory exists for multer
// const publicDir = './public';
// const tempDir = './public/temp';
// if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
// if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
// //*

// const app = express();
// // ek mthd ke through express ki sari fxnalities app me transfer hoti ha

// // ! following 3 lines of code(app.use({})) are called as configurations
// // * Middlewares:
// // when an asynchronus mthd is completed then a promise is also returned 
// app.use(cors({
//   origin: process.env.CORS_ORIGIN,
//   credentials: true
// }))

// app.use(express.json({ limit: "16kb" }))
// /*limit: "16kb" sets a maximum size for the JSON data:
// Helps prevent server crashes from very large JSON payloads (e.g., 1MB+ requests).
// Acts as a security & performance best practice.
// Prevents the server from crashing if someone tries to send a huge request.
//   */

// // url has its own encoder that encodes the data with special characters
// app.use(express.urlencoded({ extended: true, limit: "16kb" })); //we can skip giving parameters in the urlencoded
// // with extended:true, we can give objects inside the objects

// app.use(express.static("public"))
// // The line app.use(express.static("public")) is used in an Express.js application to serve static files (like images, CSS files, JavaScript files, etc.) from a specific directory. It points to the "public" directory, meaning it will look for static files in the public folder of your project.
// // It's a way to make sure that static assets (files that don’t change, like stylesheets, images, or client-side JavaScript) are accessible via URLs without needing additional routing.

// app.use(cookieParser())
// // ! above 3 are major configurations used everywhere


// // * Importing and Writing routes here in app.js

// //routes import
// import healthcheckRouter from "./routes/healthcheck.routes.js"
// import tweetRouter from "./routes/tweets.routes.js"
// import subscriptionRouter from "./routes/subscription.routes.js"
// import videoRouter from "./routes/video.routes.js"
// import commentRouter from "./routes/comment.routes.js"
// import likeRouter from "./routes/like.routes.js"
// import playlistRouter from "./routes/playlist.routes.js"
// import dashboardRouter from "./routes/dashboard.routes.js"
// import userRouter from './routes/user.routes.js'//manchaha nam hum tabhi de skte ha jab export default ho rha ho
// // jab routers and controllers are written in diff files and routers hv to be imported then we hv to use a middleware ie. we need to use app.use() instead of app.get()

// //routes declaration
// // as per standard practices we need to define api and its versioning also
// // app.use('/users', userRouter)
// app.use('/api/v1/users', userRouter)

// app.use("/api/v1/healthcheck", healthcheckRouter)
// app.use("/api/v1/tweets", tweetRouter)
// app.use("/api/v1/subscriptions", subscriptionRouter)
// app.use("/api/v1/videos", videoRouter)
// app.use("/api/v1/comments", commentRouter)
// app.use("/api/v1/likes", likeRouter)
// app.use("/api/v1/playlists", playlistRouter)//In REST APIs, resource paths are typically plural
// app.use("/api/v1/dashboard", dashboardRouter)


// // works like below
// // * app.js -> user.routes.js -> user.controller.js
// // TODO the finally called url will be http://localhost:8000/api/v1/users/register ...this is a kind of api which the frontend can hit
// // TODO this api can be tested with thunderClient
// // TODO yha route ka nam register ha and method ka name is registerUser


// // * GROK: Add a global error-handling middleware at the end of app.js:
// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internal Server Error";
//   res.status(statusCode).json({
//     success: false,
//     statusCode,
//     message,
//     errors: err.errors || []
//   });
// });
// export { app }


import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fs from 'fs';

// Ensure public/temp directory exists for Multer
const publicDir = './public';
const tempDir = './public/temp';
try {
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
} catch (err) {
  console.error("Failed to create directories for Multer:", err);
  process.exit(1);
}

const app = express();

// Middleware configurations
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Default to frontend URL if CORS_ORIGIN is not set
  credentials: true
}));

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(cookieParser());

// Routes import
import healthcheckRouter from "./routes/healthcheck.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import videoRouter from "./routes/video.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import userRouter from './routes/user.routes.js';

// Comment out until comments feature is implemented
// import commentRouter from "./routes/comment.routes.js";

// Routes declaration with API versioning
app.use('/api/v1/users', userRouter);
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);
// app.use("/api/v1/comments", commentRouter);

// Example: The full URL for the user registration endpoint is http://localhost:8000/api/v1/users/register
// This API can be tested using Postman by sending a POST request with the required fields (e.g., username, email, password, avatar)
// The flow is: app.js -> user.routes.js -> user.controller.js

// Global error-handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: Array.isArray(err.errors) ? err.errors : []
  });
});

export { app };