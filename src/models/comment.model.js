import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
        trim: true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    blogid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    }
}, { timestamps: true })

export const Comment = mongoose.model("Comment", commentSchema)