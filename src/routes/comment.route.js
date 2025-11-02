import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { addComment, allComment, deleteComment, oneComment, updateComment } from '../controllers/comment.controller.js';

const commentRoutes = new Router();

commentRoutes.post('/add', verifyJwt, addComment);
commentRoutes.get('/all/:id', verifyJwt, allComment);
commentRoutes.get('/one/:id', verifyJwt, oneComment);
commentRoutes.patch('/update/:id', verifyJwt, updateComment);
commentRoutes.delete('/delone/:id', verifyJwt, deleteComment);

export default commentRoutes
