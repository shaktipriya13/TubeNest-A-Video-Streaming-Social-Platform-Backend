import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.service.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

    const pipeline = [];
    const matchStage = { isPublished: true };
    if (userId && isValidObjectId(userId)) {
        matchStage.owner = new mongoose.Types.ObjectId(userId);
    }
    if (query) {
        matchStage.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }
    pipeline.push({ $match: matchStage });

    pipeline.push({
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [
                { $project: { username: 1, avatar: 1 } }
            ]
        }
    });
    pipeline.push({ $unwind: "$owner" });

    const sortStage = {};
    sortStage[sortBy] = sortType === "asc" ? 1 : -1;
    pipeline.push({ $sort: sortStage });

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    const videos = await Video.aggregatePaginate(Video.aggregate(pipeline), options);

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully.")
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required.");
    }

    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required.");
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required.");
    }

    // Upload to Cloudinary with explicit resource types
    const videoFile = await uploadOnCloudinary(videoFileLocalPath, "video");
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath, "image");

    if (!videoFile || !thumbnail) {
        throw new ApiError(500, "Failed to upload video or thumbnail to Cloudinary.");
    }

    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: videoFile.duration || 0,
        owner: req.user._id,
        isPublished: true
    });

    if (!video) {
        throw new ApiError(500, "Failed to create video in the database.");
    }

    return res.status(201).json(
        new ApiResponse(201, video, "Video published successfully.")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    const video = await Video.findById(videoId)
        .populate("owner", "username avatar");

    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully.")
    );
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video.");
    }

    if (title) video.title = title;
    if (description) video.description = description;

    if (req.file) {
        const thumbnailLocalPath = req.file.path;
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath, "image");
        if (!thumbnail) {
            throw new ApiError(500, "Failed to upload new thumbnail to Cloudinary.");
        }
        if (video.thumbnail) {
            const publicId = video.thumbnail.split("/").pop().split(".")[0];
            await deleteFromCloudinary(publicId, "image");
        }
        video.thumbnail = thumbnail.url;
    }

    await video.save();

    return res.status(200).json(
        new ApiResponse(200, video, "Video updated successfully.")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this video.");
    }

    if (video.videoFile) {
        const videoPublicId = video.videoFile.split("/").pop().split(".")[0];
        await deleteFromCloudinary(videoPublicId, "video");
    }
    if (video.thumbnail) {
        const thumbnailPublicId = video.thumbnail.split("/").pop().split(".")[0];
        await deleteFromCloudinary(thumbnailPublicId, "image");
    }

    await Video.findByIdAndDelete(videoId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully.")
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to toggle the publish status of this video.");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    return res.status(200).json(
        new ApiResponse(200, { isPublished: video.isPublished }, "Publish status toggled successfully.")
    );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
};