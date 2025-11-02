import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_RUL}/blogs`)
        console.log("db connected successfully ")
    } catch (error) {
        console.log("db not Connected")
    }
} 