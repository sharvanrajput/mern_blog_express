import mongoose from "mongoose";

const bloglikeSchema = new mongoose.Schema({

    blogid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },



}, { timestamps: true })

export const BlogLikes = mongoose.model("BlogLikes", bloglikeSchema)