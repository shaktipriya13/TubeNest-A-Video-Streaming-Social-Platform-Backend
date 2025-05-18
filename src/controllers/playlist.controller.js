import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    // Validate input
    if (!name) {
        throw new ApiError(400, "Name is required.");
    }

    // Create the playlist
    const playlist = await Playlist.create({
        name,
        description: description || "",
        owner: req.user._id,
        videos: [],
    });

    if (!playlist) {
        throw new ApiError(500, "Failed to create playlist.");
    }

    return res.status(201).json(
        new ApiResponse(201, playlist, "Playlist created successfully.")
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
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

    // Fetch playlists by the user
    const playlists = await Playlist.find({ owner: userId })
        .populate("videos", "title thumbnail duration")
        .populate("owner", "username avatar");

    return res.status(200).json(
        new ApiResponse(200, playlists, "User playlists fetched successfully.")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    // Validate playlistId
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID.");
    }

    // Fetch the playlist
    const playlist = await Playlist.findById(playlistId)
        .populate("videos", "title thumbnail duration")
        .populate("owner", "username avatar");

    if (!playlist) {
        throw new ApiError(404, "Playlist not found.");
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist fetched successfully.")
    );
});

// const addVideoToPlaylist = asyncHandler(async (req, res) => {
//     const { playlistId, videoId } = req.params;

//     // Validate playlistId and videoId
//     if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
//         throw new ApiError(400, "Invalid playlist ID or video ID.");
//     }

//     // Check if the playlist exists
//     const playlist = await Playlist.findById(playlistId);
//     if (!playlist) {
//         throw new ApiError(404, "Playlist not found.");
//     }

//     // Check if the video exists
//     const video = await Video.findById(videoId);
//     if (!video) {
//         throw new ApiError(404, "Video not found.");
//     }

//     // Check if the logged-in user is the owner of the playlist
//     if (playlist.owner.toString() !== req.user._id.toString()) {
//         throw new ApiError(403, "You are not authorized to modify this playlist.");
//     }

//     // Check if the video is already in the playlist
//     if (playlist.videos.includes(videoId)) {
//         throw new ApiError(400, "Video is already in the playlist.");
//     }

//     // Add the video to the playlist
//     playlist.videos.push(videoId);
//     await playlist.save();

//     // Fetch the updated playlist with populated fields
//     const updatedPlaylist = await Playlist.findById(playlistId)
//         .populate("videos", "title thumbnail duration")
//         .populate("owner", "username avatar");

//     return res.status(200).json(
//         new ApiResponse(200, updatedPlaylist, "Video added to playlist successfully.")
//     );
// });

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist ID or video ID.");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found.");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    // Add logging to debug
    console.log("playlist.owner:", playlist.owner);
    console.log("req.user:", req.user);

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to modify this playlist.");
    }

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video is already in the playlist.");
    }

    playlist.videos.push(videoId);
    await playlist.save();

    const updatedPlaylist = await Playlist.findById(playlistId)
        .populate("videos", "title thumbnail duration")
        .populate("owner", "username avatar");

    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Video added to playlist successfully.")
    );
});
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    // Validate playlistId and videoId
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist ID or video ID.");
    }

    // Check if the playlist exists
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found.");
    }

    // Check if the video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    // Check if the logged-in user is the owner of the playlist
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to modify this playlist.");
    }

    // Check if the video is in the playlist
    const videoIndex = playlist.videos.indexOf(videoId);
    if (videoIndex === -1) {
        throw new ApiError(400, "Video is not in the playlist.");
    }

    // Remove the video from the playlist
    playlist.videos.splice(videoIndex, 1);
    await playlist.save();

    // Fetch the updated playlist with populated fields
    const updatedPlaylist = await Playlist.findById(playlistId)
        .populate("videos", "title thumbnail duration")
        .populate("owner", "username avatar");

    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully.")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    // Validate playlistId
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID.");
    }

    // Find the playlist
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found.");
    }

    // Check if the logged-in user is the owner
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this playlist.");
    }

    // Delete the playlist
    await Playlist.findByIdAndDelete(playlistId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Playlist deleted successfully.")
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    // Validate playlistId
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID.");
    }

    // Validate input
    if (!name) {
        throw new ApiError(400, "Name is required.");
    }

    // Find the playlist
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found.");
    }

    // Check if the logged-in user is the owner
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this playlist.");
    }

    // Update the playlist
    playlist.name = name;
    playlist.description = description || "";
    const updatedPlaylist = await playlist.save();

    // Populate the updated playlist
    const populatedPlaylist = await Playlist.findById(playlistId)
        .populate("videos", "title thumbnail duration")
        .populate("owner", "username avatar");

    return res.status(200).json(
        new ApiResponse(200, populatedPlaylist, "Playlist updated successfully.")
    );
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
};