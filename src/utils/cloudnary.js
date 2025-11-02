import { v2 as cloudinary } from "cloudinary"
import { response } from "express";
import fs from "fs"

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECREAT  // Click 'View API Keys' above to copy your API secret
});

export const uploadOnCloudinary = async (localFilePath) => {
    try {

        if (!localFilePath) return null

        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        console.log("file uploaded successfully", res.url)
        fs.unlinkSync(localFilePath)
        // console.log(res)
        return res

    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the temp file as the upload oprtion got failed
    }
}