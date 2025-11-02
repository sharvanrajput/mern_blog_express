import { Router } from 'express';
import { addBlog, deleteBlog, getAllBlog, updateBlog, getOneBlog, getCurrentUserBlog, blogBySlug, getAllUsersBlog, blogByCategory } from '../controllers/blog.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const blogRotue = Router()

blogRotue.post("/add", verifyJwt, upload.single("blogimg"), addBlog)

// get my all blog 

blogRotue.get("/getblog", verifyJwt, getAllBlog)

// get all user blog 
blogRotue.get("/getalluserblog", verifyJwt, getAllUsersBlog)

// get one blog 

blogRotue.get("/getoneblog/:id", verifyJwt, getOneBlog)

// get blog by category 

blogRotue.get("/getoneblog/:category/:slug", verifyJwt, blogByCategory)

// get by slug blog 

blogRotue.post("/blogbyslug/:slug", verifyJwt, blogBySlug)

// current user all blog 

blogRotue.get("/getcurrentuserblog/:id", verifyJwt, getCurrentUserBlog)

// update blog 

blogRotue.patch("/updateblog/:id", verifyJwt, upload.single("blogimg"), updateBlog)

// update blog 

blogRotue.delete("/delete/:id", verifyJwt, deleteBlog)

export default blogRotue
