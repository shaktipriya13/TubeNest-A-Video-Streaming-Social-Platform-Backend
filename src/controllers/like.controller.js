import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/likes.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
/*steps:
Goal: Toggle a like on a video. If the user has already liked the video, remove the like; otherwise, add a like.
Implementation:
Validate the videoId.
Check if the video exists.
Check if the user has already liked the video (query the Like model).
If liked, remove the like; if not, create a new like. */
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Validate videoId
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    // Check if the video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    // Check if the user has already liked the video
    const userId = req.user._id;
    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: userId
    });

    if (existingLike) {
        // If already liked, remove the like
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(
            new ApiResponse(200, { liked: false }, "Video unliked successfully.")
        );
    } else {
        // If not liked, add a new like
        await Like.create({
            video: videoId,
            likedBy: userId
        });
        return res.status(200).json(
            new ApiResponse(200, { liked: true }, "Video liked successfully.")
        );
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    // Validate commentId
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID.");
    }

    // Check if the comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found.");
    }

    // Check if the user has already liked the comment
    const userId = req.user._id;
    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: userId
    });

    if (existingLike) {
        // If already liked, remove the like
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(
            new ApiResponse(200, { liked: false }, "Comment unliked successfully.")
        );
    } else {
        // If not liked, add a new like
        await Like.create({
            comment: commentId,
            likedBy: userId
        });
        return res.status(200).json(
            new ApiResponse(200, { liked: true }, "Comment liked successfully.")
        );
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    // Validate tweetId
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID.");
    }

    // Check if the tweet exists
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found.");
    }

    // Check if the user has already liked the tweet
    const userId = req.user._id;
    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: userId
    });

    if (existingLike) {
        // If already liked, remove the like
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(
            new ApiResponse(200, { liked: false }, "Tweet unliked successfully.")
        );
    } else {
        // If not liked, add a new like
        await Like.create({
            tweet: tweetId,
            likedBy: userId
        });
        return res.status(200).json(
            new ApiResponse(200, { liked: true }, "Tweet liked successfully.")
        );
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Find all likes by the user where the video field is not null
    const likes = await Like.find({
        likedBy: userId,
        video: { $ne: null } // Ensure the video field exists
    })
        .populate({
            path: "video",
            select: "title description thumbnail videoFile duration creator",
            populate: {
                path: "creator",
                select: "username avatar"
            }
        });

    // Extract the videos from the likes
    const likedVideos = likes
        .filter(like => like.video) // Ensure video exists
        .map(like => like.video);

    return res.status(200).json(
        new ApiResponse(200, likedVideos, "Liked videos fetched successfully.")
    );
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};