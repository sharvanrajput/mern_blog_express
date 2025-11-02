import { Category } from "../models/categorie.model.js";

export const addCategory = async (req, res) => {
    try {
        const { category, slug } = req.body

        console.log({ category, slug })

        const createdCategory = await Category.create({ category, slug })

        res.status(201).send({ success: true, message: "category created successfully", createdCategory })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error: ${error.message}`,
        });
    }
}


export const allCategory = async (req, res) => {
    try {

        const allCategory = await Category.find().sort({createdAt:-1})
        res.status(200).send({ success: true, message: "category created successfully", allCategory })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error: ${error.message}`,
        });
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        const { category, slug } = req.body

        const updateCategory = await Category.findByIdAndUpdate(id, { category, slug }, { new: true })

        res.status(200).send({ success: true, message: "category created successfully", updateCategory })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error: ${error.message}`,
        });
    }
}


export const oneCategory = async (req, res) => {
    try {
        const { id } = req.params

        const oneCategory = await Category.findById(id)

        res.status(200).send({ success: true, message: "category created successfully", oneCategory })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error: ${error.message}`,
        });
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params

        const delCategory = await Category.findByIdAndDelete(id)

        res.status(200).send({ success: true, message: "category created successfully", delCategory })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error: ${error.message}`,
        });
    }
}

