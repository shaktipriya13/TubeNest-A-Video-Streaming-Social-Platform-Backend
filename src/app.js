import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
// the above 3 packages gets configured only after they become an app

const app = express();
// ek mthd ke through express ki sari fxnalities app me transfer hoti ha

// ! following 3 lines of code(app.use({})) are called as configurations
// when an asynchronus mthd is completed then a promise is also returned 
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
/*limit: "16kb" sets a maximum size for the JSON data:
Helps prevent server crashes from very large JSON payloads (e.g., 1MB+ requests).
Acts as a security & performance best practice.
Prevents the server from crashing if someone tries to send a huge request.
  */

// url has its own encoder that encodes the data with special characters
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //we can skip giving parameters in the urlencoded
// with extended:true, we can give objects inside the objects

app.use(express.static("public"))
// The line app.use(express.static("public")) is used in an Express.js application to serve static files (like images, CSS files, JavaScript files, etc.) from a specific directory. It points to the "public" directory, meaning it will look for static files in the public folder of your project.
// It's a way to make sure that static assets (files that don’t change, like stylesheets, images, or client-side JavaScript) are accessible via URLs without needing additional routing.

app.use(cookieParser())
// ! above 3 are major configurations used everywhere

export { app }