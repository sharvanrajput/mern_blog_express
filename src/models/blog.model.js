import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        trim: true,
        required: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
    },
    blogcontent: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    blogimg: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }

}, { timestamps: true })

export const Blog = mongoose.model("Blog", blogSchema)