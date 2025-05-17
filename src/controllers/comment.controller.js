import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js"; // To validate video existence
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/*Steps:

Validate the videoId from req.params.
Parse page and limit from req.query for pagination.
Use Mongoose to query comments for the given videoId, with pagination.
Populate the owner field to include user details (e.g., username, avatar).
Return the comments in an ApiResponse.

*/

const getVideoComments = asyncHandler(async (req, res) => {
    // Get all comments for a video
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate videoId
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    // Check if the video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    // Parse page and limit for pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Fetch comments with pagination and populate owner details
    const comments = await Comment.find({ video: videoId })
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 }) // Newest comments first
        .populate("owner", "username avatar");

    if (!comments) {
        throw new ApiError(404, "No comments found for this video.");
    }

    // Get total comment count for pagination metadata
    const totalComments = await Comment.countDocuments({ video: videoId });

    const response = {
        comments,
        pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalComments / limitNum),
            totalComments,
            limit: limitNum
        }
    };

    return res.status(200).json(
        new ApiResponse(200, response, "Comments fetched successfully.")
    );
});


/*Purpose: Allow a logged-in user to add a comment to a video.
Steps:
Validate the videoId from req.params and content from req.body.
Check if the video exists.
Create a new comment with the user as the owner and the specified video.
Return the new comment in an ApiResponse.

*/
const addComment = asyncHandler(async (req, res) => {
    // Add a comment to a video
    const { videoId } = req.params;
    const { content } = req.body;

    // Validate inputs
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content is required.");
    }

    // Check if the video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    // Create the comment
    const comment = await Comment.create({
        content: content.trim(),
        video: videoId,
        owner: req.user._id // From verifyJWT middleware
    });

    if (!comment) {
        throw new ApiError(500, "Failed to add comment.");
    }

    // Populate owner details for the response
    const createdComment = await Comment.findById(comment._id)
        .populate("owner", "username avatar");

    return res.status(201).json(
        new ApiResponse(201, createdComment, "Comment added successfully.")
    );
});
/*updateComment (Update a Comment)
Purpose: Allow the comment owner to update the content of their comment.
Steps:
Validate the commentId from req.params and content from req.body.
Check if the comment exists and if the logged-in user is the owner.
Update the comment’s content.
Return the updated comment in an ApiResponse.

*/
const updateComment = asyncHandler(async (req, res) => {
    // Update a comment
    const { commentId } = req.params;
    const { content } = req.body;

    // Validate inputs
    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID.");
    }
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Updated comment content is required.");
    }

    // Check if the comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found.");
    }

    // Check if the user is the owner of the comment
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment.");
    }

    // Update the comment
    comment.content = content.trim();
    const updatedComment = await comment.save();

    // Populate owner details for the response
    const populatedComment = await Comment.findById(updatedComment._id)
        .populate("owner", "username avatar");

    return res.status(200).json(
        new ApiResponse(200, populatedComment, "Comment updated successfully.")
    );
});
/*deleteComment (Delete a Comment)
Purpose: Allow the comment owner to delete their comment.
Steps:
Validate the commentId from req.params.
Check if the comment exists and if the logged-in user is the owner.
Delete the comment.
Return a success message in an ApiResponse

*/
const deleteComment = asyncHandler(async (req, res) => {
    // Delete a comment
    const { commentId } = req.params;

    // Validate commentId
    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID.");
    }

    // Check if the comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found.");
    }

    // Check if the user is the owner of the comment
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this comment.");
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted successfully.")
    );
});

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
};