import multer from "multer"
import path from "path"


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(process.cwd(), "public");
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
})

export const upload = multer({ storage: storage })