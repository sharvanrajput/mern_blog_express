import mongoose from "mongoose";
import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./src/db/db.js";
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
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/public", express.static("public"));

app.use("/api/auth", authRoute);
app.use("/api/blog", blogRoute);
app.use("/api/category", categoryRoute);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeblogRoute);


connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})
