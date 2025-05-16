import mongoose, { Schema } from "mongoose";
// we would be liking videos, comments, tweets
// agar later on we get more videos uploaded from a single playlist then we can add the pagination
const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videos: [{
        // videos of a playlist will be an array of objects (ie. key-value pairs of  ObjectId and ref)
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

export const Playlist = mongoose.model("Playlist", playlistSchema);