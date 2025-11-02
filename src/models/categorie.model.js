import mongoose from "mongoose";

const cagetorySchema = new mongoose.Schema({

    category: {
        type: String,
        require: true,
    },
    slug: {
        type: String,
        require: true,
    }

}, { timestamps: true })

export const Category = mongoose.model("Category", cagetorySchema)