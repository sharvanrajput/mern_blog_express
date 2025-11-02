import mongoose from "mongoose";
import { Blog } from "../models/blog.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { encode } from "entities";

export const addBlog = async (req, res) => {
    try {

        const { id } = req.user
        const { title, slug, blogcontent, category } = req.body

        const blogimgpath = req.file ? req.file.path : undefined;

        const endodedblogcont = encode(blogcontent)

        console.log("checking blog DATA", { title, slug, blogcontent, category })
        if ([title, slug, blogcontent, category].some(field => !field || field.trim() === "")) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // console.log("blog fild", { title, slug, blogcontent, category, blogimgpath, author: id })

        if (!blogimgpath?.trim()) {
            return res.status(400).json({ success: false, message: "Blog photo is required" })
        }

        const cloutnaryblogimg = await uploadOnCloudinary(blogimgpath)

        const blog = await Blog.create({
            title, slug, blogcontent: endodedblogcont, category, blogimg: cloutnaryblogimg.url, author: id
        })
        return res.status(201).json({ success: true, message: "blog created successfully", blog })

    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error ${error.message}` })
    }
}

export const getAllBlog = async (req, res) => {
    try {
        const { _id } = req.user
        const blog = await Blog.find({ author: _id }).populate("author", " fullname email profile ").populate("category", "category slug").sort({ createdAt: -1 });
        return res.status(200).send({ success: true, message: "blog fetched successfuly", blog })
    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error ${error.message}` })
    }
}
export const getAllUsersBlog = async (req, res) => {
    try {

        const blog = await Blog.find().populate("author", " fullname email profile ").populate("category", "category slug").sort({ createdAt: -1 });
        return res.status(200).send({ success: true, message: "blog fetched successfuly", blog })
    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error ${error.message}` })
    }
}

export const getOneBlog = async (req, res) => {
    try {
        const { id } = req.params
        const blog = await Blog.findById(id).populate("author", " fullname email profile ");
        return res.status(200).send({ success: true, message: "blog fetched successfuly", blog })
    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error ${error.message}` })
    }
}

export const blogBySlug = async (req, res) => {
    try {

        const { slug } = req.params

        console.log(req.body)

        const blog = await Blog.findOne({ slug }).populate("author", " fullname email profile ")

        return res.status(200).send({ success: true, message: "blog fetched successfuly", blog })


    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error ${error.message}` })
    }
}
export const blogByCategory = async (req, res) => {
    try {

        const { category, slug } = req.params


        const blog = await Blog.find({
            category,
            slug: { $ne: slug } // Exclude the current blog
        }).populate("author", " fullname email profile ")

        return res.status(200).send({ success: true, message: "blog fetched successfuly", blog })


    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error ${error.message}` })
    }
}

export const getCurrentUserBlog = async (req, res) => {
    try {
        const { id } = req.user
        const blogs = await Blog.find({ author: id }).populate("author", " fullname email profile ");
        return res.status(200).send({ success: true, message: "blog fetched successfuly", blogs })
    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error ${error.message}` })
    }
}



export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params
        const { title, slug, blogcontent, category } = req.body

        const blogimgpath = req.file ? req.file.path : undefined;

        const endodedblogcont = encode(blogcontent)

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid blog ID" });
        }

        if (!endodedblogcont?.trim()) {
            return res.status(400).json({ success: false, message: "Blog photo is required" })
        }

        const cloutnaryblogimg = await uploadOnCloudinary(blogimgpath)

        const updateData = { title, slug, blogcontent, category };
        if (cloutnaryblogimg) updateData.blogimg = cloutnaryblogimg.url;

        const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedBlog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            updatedBlog,
        });
    } catch (error) {
        console.log("Error while updating blog:", error); // 👈 print exact error
        return res.status(500).json({
            success: false,
            message: `Internal Server Error: ${error.message}`,
        });
    }
};

export const deleteBlog = async (req, res) => {
    try {

        const { id } = req.params
        const deleteedblog = await Blog.findByIdAndDelete(id)
        res.status(200).send({ success: true, message: "blog deleted successfully", deleteedblog })

    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error ${error.message}` })
    }
}