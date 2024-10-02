import prisma from "../utils/prisma.js"
import bcrypt from "bcrypt"

export const getUsers = async (req, res) => {
    console.log("It Works")
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({
            message: "Failed to get users"
        })
    }
}
export const getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({
            message: "Failed to get user"
        })
    }
}
export const updateUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    const { password, avatar, ...inputs } = req.body;

    if (id != tokenUserId) {
        return res.status(403).json({ message: "Not Authenticated!" })
    }

    let updatedPassword;
    if (password) {
        updatedPassword = await bcrypt.hash(password, 10)
    }
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...inputs,
                ...(updatedPassword && { password: updatedPassword }),
                ...(avatar && { avatar })
            }
        })
        const { password: userpassword, ...info } = updatedUser;
        res.status(200).json(info)
    } catch (err) {
        res.status(500).json({
            message: "Failed to update user"
        })
    }
}
export const deleteUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    if (id != tokenUserId) {
        return res.status(403).json({ message: "Not Authenticated!" })
    }
    try {
        await prisma.user.delete({
            where: { id }
        })
        res.status(200).json({ message: 'user deleted Successfully!' })
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete user"
        })
    }
}



export const profilePosts = async (req, res) => {
    const tokenUserId = req.userId;
    try {
        const userPosts = await prisma.post.findMany({
            where: { userId: tokenUserId },
        });
        const saved = await prisma.savedPost.findMany({
            where: { userId: tokenUserId },
            include: {
                post: true,
            },
        });

        const savedPosts = saved.map((item) => item.post);
        res.status(200).json({ userPosts, savedPosts });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get profile posts!" });
    }
};

export const savePost = async (req, res) => {
    const postId = req.body.postId;
    const tokenUserId = req.userId;

    try {
        const savedPosts = await prisma.savedPost.findUnique({
            where: {
                userId_postId: {
                    userId: tokenUserId,
                    postId,
                }
            }
        })
        if (!savedPosts) {
            console.log("post is not saved")
            const postSaved = await prisma.savedPost.create({
                data: {
                    userId: tokenUserId,
                    postId: postId,
                }
            })
            console.log(postSaved)
            res.status(200).json({ message: 'Post Saved Successfully!' })

        }
        else {
            await prisma.savedPost.delete({
                where: {
                    id: savedPosts.id
                }
            })
            res.status(200).json({ message: "Saved Post is removed" })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Failed to delete user"
        })
    }
}

export const getNotificationNumber = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        const number = await prisma.chat.count({
            where: {
                userIDs: {
                    hasSome: [tokenUserId]
                },
                NOT: {
                    seenBy: {
                        hasSome: [tokenUserId]
                    }
                }
            }
        })
        res.status(200).json(number)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Failed to delete user"
        })
    }
}