import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
// It imports a plugin that adds pagination support to MongoDB aggregation queries using Mongoose.

const videoSchema = new Schema({
    videoFile: {
        type: String,//cloudinary url string
        required: [true, 'video is required to upload']
    },
    thumbnail: {
        type: String,//cloudinary url string
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,//duration is not given by user ...it is given by cloudinary ...once the video is uploaded cloudinary sends the detailsof uploaded video    
        required: true
    },
    views: {
        type: Number, default: 0
    },
    isPublished: {//means is the video publicly available or not
        type: Boolean, default: true
    },
    creator: {
        type: Schema.Types.ObjectId, ref: "User"
    }
}, { timestamps: true })

videoSchema.plugin(mongooseAggregatePaginate);//after this now we can write the aggregation queries

export const Video = mongoose.model('Video', videoSchema);