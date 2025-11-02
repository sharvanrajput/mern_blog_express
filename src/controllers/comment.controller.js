import { Comment } from "../models/comment.model.js"

export const addComment = async (req, res) => {
    try {
        const { id } = req.user
        const { comment, blogid } = req.body

        if ([comment, blogid].some(fields => !fields)) {
            return res.status(400).json({ success: false, message: "Comment or blog id is missing" });
        }


        const createComment = await Comment.create({ userid: id, blogid, comment })

        return res.status(201).json({ success: true, message: "Comment add Successfully", comment: createComment })

    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error ${error.message}` })
    }
}

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params
        const { comment } = req.body


        if ([comment, id].map(fields => !fields || fields.trim() === "")) {
            return res.status(400).json({ success: false, message: "Comment id is missing" });
        }
        console.log("comment update datra",id, comment)

        const updateComment = await Comment.findByIdAndUpdate({ id }, { comment }, { new: true })

        return res.status(201).json({ success: true, message: "Comment update Successfully", comment: updateComment })

    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error ${error.message}` })
    }
}
export const oneComment = async (req, res) => {
    try {
        const { id } = req.params

        const onecomment = await Comment.findById(id)

        return res.status(201).json({ success: true, message: "fatch one Comment Successfully", comment: onecomment })

    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error ${error.message}` })
    }
}
export const allComment = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Blog ID is required",
            });
        }

        const allcomment = await Comment.find({ blogid: id }).populate("userid", " fullname email profile ").sort({ createdAt: -1 })

        return res.status(201).json({ success: true, message: "fatch all Comment Successfully", comments: allcomment, })

    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error ${error.message}` })
    }
}
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params

        const deletedComment = await Comment.findByIdAndDelete(id)

        return res.status(201).json({ success: true, message: "Comment delete Successfully", comment: deletedComment })

    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error ${error.message}` })
    }
}