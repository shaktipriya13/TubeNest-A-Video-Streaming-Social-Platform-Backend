// this middleware is reusable
// this is our own middleware made by us..this will verify whether user is presnt or not
// when user is lgged in , he's given both tokens and on their basis its verified whether he is logged in or not
// if the tokens with the user are correct , then only its a valid user

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// next takes to response or next middleware
// export const verifyJWT = asyncHandler(async (req, res, next) => {
// yha res was not used so in production grade code,its replaced by _
export const verifyJWT = asyncHandler(async (req, _, next) => {
    // wrapping in try catch bcoz db failure may occur
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request.")
        }

        // generated tokens are encoded and then sent to user. But they can be decoded only by jwt bcoz they hav public key secret and now we can receive the decoded web token.
        // we always want raw token which is stored in db
        const decodedTokenInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedTokenInfo?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid access token.")
        }

        // if we have user: then do this->
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token.")
    }

})