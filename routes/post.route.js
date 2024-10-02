import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";

import { addPost, deletePost, getPost, getPosts, updatepost } from "../controller/post.controller.js";

const router = express.Router();

router.get('/', getPosts)
router.get('/:id', getPost)
router.post('/', verifyToken, addPost)
router.put('/:id', verifyToken, updatepost)
router.delete('/:id', verifyToken, deletePost)


export default router;