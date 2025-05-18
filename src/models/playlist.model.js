import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""  // Optional, with a default value of empty string
    },
    videos: [{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })

export const Playlist = mongoose.model("Playlist", playlistSchema);