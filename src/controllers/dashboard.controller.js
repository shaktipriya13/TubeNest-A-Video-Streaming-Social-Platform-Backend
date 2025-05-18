// What is a Dashboard?
// In your project, a dashboard is like a personal overview page for a user(like a YouTube owner).It shows important information about their channel in one place.Think of it as a summary that helps the user(the channel owner) quickly see how their channel is doing without digging through lots of details.


import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/likes.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    // Get the logged-in user's ID
    const userId = req.user._id;

    // 1. Total Video Views: Sum the views of all videos uploaded by the user
    const videoStats = await Video.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" },
                totalVideos: { $sum: 1 }
            }
        }
    ]);

    const totalViews = videoStats.length > 0 ? videoStats[0].totalViews : 0;
    const totalVideos = videoStats.length > 0 ? videoStats[0].totalVideos : 0;

    // 2. Total Subscribers: Count subscriptions where the channel is the user
    const totalSubscribers = await Subscription.countDocuments({ channel: userId });

    // 3. Total Likes: Count likes on videos uploaded by the user
    const videos = await Video.find({ owner: userId }).select("_id");
    const videoIds = videos.map(video => video._id);
    const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });

    // Prepare the stats object
    const stats = {
        totalViews,
        totalSubscribers,
        totalVideos,
        totalLikes
    };

    return res.status(200).json(
        new ApiResponse(200, stats, "Channel stats fetched successfully.")
    );
});

// const getChannelVideos = asyncHandler(async (req, res) => {
//     // Get the logged-in user's ID
//     const userId = req.user._id;

//     // Fetch all videos uploaded by the user
//     const videos = await Video.find({ owner: userId })
//         .populate("owner", "username avatar")
//         .sort({ createdAt: -1 }); // Sort by creation date (newest first)

//     return res.status(200).json(
//         new ApiResponse(200, videos, "Channel videos fetched successfully.")
//     );
// });

const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    console.log("Logged-in userId:", userId.toString());

    const videos = await Video.find({ owner: userId })
        .populate("owner", "username avatar")
        .sort({ createdAt: -1 });
    console.log("Found videos:", videos);

    return res.status(200).json(
        new ApiResponse(200, videos, "Channel videos fetched successfully.")
    );
});

export {
    getChannelStats,
    getChannelVideos
};