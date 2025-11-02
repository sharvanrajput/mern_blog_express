import mongoose from "mongoose";
import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// import { connectDB } from "./src/db/db.js";
import authRoute from "./src/routes/user.route.js";
import blogRoute from "./src/routes/blog.route.js";
import categoryRoute from "./src/routes/category.route.js";
import commentRoutes from "./src/routes/comment.route.js";
import likeblogRoute from "./src/routes/likeblog.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // ✅ check spelling
    credentials: true,
  })
);

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/public", express.static("public"));

app.use("/api/auth", authRoute);
app.use("/api/blog", blogRoute);
app.use("/api/category", categoryRoute);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeblogRoute);


let isConnected = false


export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_RUL}/blogs`)
    isConnected = true
    console.log("db connected successfully ")
  } catch (error) {
    console.log("db not Connected")
  }
}

// app.use((req, res, next) => {
//   if (!isConnected) connectDB()
//   next()
// })

await connectDB();

app.get("/", (req, res) => {
  res.send("Backend is running on vercel check");
});

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

export default app;
