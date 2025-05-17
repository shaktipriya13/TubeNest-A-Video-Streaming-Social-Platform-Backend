import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    // Validate input
    if (!content) {
        throw new ApiError(400, "Content is required.");
    }

    // Create the tweet
    const tweet = await Tweet.create({
        content,
        owner: req.user._id,
    });

    if (!tweet) {
        throw new ApiError(500, "Failed to create tweet.");
    }

    return res.status(201).json(
        new ApiResponse(201, tweet, "Tweet created successfully.")
    );
});

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Validate userId
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID.");
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    // Fetch tweets by the user
    const tweets = await Tweet.find({ owner: userId })
        .populate("owner", "username avatar");

    return res.status(200).json(
        new ApiResponse(200, tweets, "User tweets fetched successfully.")
    );
});

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    // Validate tweetId
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID.");
    }

    // Validate content
    if (!content) {
        throw new ApiError(400, "Content is required.");
    }

    // Find the tweet
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found.");
    }

    // Check if the logged-in user is the owner
    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this tweet.");
    }

    // Update the tweet
    tweet.content = content;
    const updatedTweet = await tweet.save();

    return res.status(200).json(
        new ApiResponse(200, updatedTweet, "Tweet updated successfully.")
    );
});

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    // Validate tweetId
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID.");
    }

    // Find the tweet
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found.");
    }

    // Check if the logged-in user is the owner
    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this tweet.");
    }

    // Delete the tweet
    await Tweet.findByIdAndDelete(tweetId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Tweet deleted successfully.")
    );
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
};