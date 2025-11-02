import { Router } from 'express';
import { likesOnBlog, toggleBlogLike, userLikeAtBlog } from '../controllers/likeblog.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';

const likeblogRoute = Router()

likeblogRoute.post("/togglelike/:blogid", verifyJwt, toggleBlogLike)
likeblogRoute.post("/likeonblog/:blogid", verifyJwt, likesOnBlog)
likeblogRoute.post("/userlikeatblog/", verifyJwt, userLikeAtBlog)

export default likeblogRoute
