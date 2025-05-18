import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
    // Return a simple healthcheck response
    return res.status(200).json(
        new ApiResponse(200, {}, "Server is healthy")
    );
});

export {
    healthcheck
};