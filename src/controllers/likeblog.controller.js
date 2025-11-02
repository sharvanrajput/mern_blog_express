import { BlogLikes } from "../models/likeblog.model.js";

export const toggleBlogLike = async (req, res) => {
    try {
        const { _id } = req.user;       // user ID from verifyJwt middleware
        const { blogid } = req.params;  // blog ID from frontend

        // ✅ Check if user already liked THIS blog
        const existingLike = await BlogLikes.findOne({ blogid, userid: _id });

        if (!existingLike) {
            // 👍 Like this blog
            const newLike = await BlogLikes.create({ blogid, userid: _id });
            return res.status(201).json({
                success: true,
                message: "Blog liked successfully",
                like: newLike,
            });
        } else {
            // 👎 Unlike (remove like) for this blog
            await BlogLikes.findOneAndDelete({ blogid, userid: _id });
            return res.status(200).json({
                success: true,
                message: "Blog unliked successfully",
            });
        }

    } catch (error) {
        console.error("Toggle Like Error:", error);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error: ${error.message}`,
        });
    }
};




export const likesOnBlog = async (req, res) => {
    try {

        const { blogid } = req.params

        const bloglike = await BlogLikes.find({ blogid })

        const countlike = await BlogLikes.countDocuments({ blogid })
        console.log(bloglike)

        return res.status(200).send({ success: true, message: "all like here", bloglike, likecount: countlike }); // ✅ added return


    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
    }
};

export const userLikeAtBlog = async (req, res) => {
    try {
        const { _id } = req.user

        const userlikes = await BlogLikes.find({ userid: _id })

        return res.status(200).send({ success: true, message: "unliked", userlikes }); // ✅ added return



    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
    }
};