import { asyncHandler } from '../utils/asyncHandler.js'

//fxn to register a user: below is a fixed syntax that we hv to use everytime
const registerUser = asyncHandler(async (req, res) => {
    // In JavaScript, especially in Express, once you send a response using res.json() or res.send(), the function doesn't need to return
    /*You should use return if:1. You have more code after the response that you want to skip | 2. You're inside a conditional block*/
    res.status(200).json({
        // here instead of 200 any http status code u could write like400,403 etc. to show to the client...it totally depends on the backend engineer what he wants to show
        message: "chai ausadsar code"
    })
})

export { registerUser }