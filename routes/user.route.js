import express from "express"
import { deleteUser, getUser, getUsers, updateUser, savePost, profilePosts, getNotificationNumber } from "../controller/user.controller.js";
import { verifyToken } from "../middleware/VerifyToken.js";
const router = express.Router();


// to register a user
router.get('/', getUsers)
// router.get('/:id', verifyToken, getUser)
router.put('/:id', verifyToken, updateUser)
router.get('/profilePosts', verifyToken, profilePosts)
router.delete('/:id', verifyToken, deleteUser)
router.post('/save', verifyToken, savePost)
router.get('/notification', verifyToken, getNotificationNumber)
export default router;