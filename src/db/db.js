import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/blogs`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
        })
        console.log("db connected successfully ")
    } catch (error) {
        console.log("db not Connected")
    }
} 