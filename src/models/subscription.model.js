import mongoose, { Schema } from "mongoose";

// both subscriber and channel are users
// both channel and user refers to the same things actually
const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId,//one who is subscribing
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId,//one to whom subscriber is subscribing
        ref: "User"
    }
}, { timestamps: true })

export const Subscription = mongoose.model("Subscription", subscriptionSchema)