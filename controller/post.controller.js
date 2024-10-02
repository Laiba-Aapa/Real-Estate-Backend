import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js"
export const getPosts = async (req, res) => {
    const query = req.query;
    console.log(query)
    const bedroomInt = parseInt(query.bedroom)
    const minPriceInt = parseInt(query.minPrice)
    const maxPriceInt = parseInt(query.maxPrice)
    console.log({ bedroomInt, minPriceInt, maxPriceInt })
    try {
        const posts = await prisma.post.findMany({
            where: {
                City: query.City || undefined,
                type: query.type || undefined,
                property: query.property || undefined,
                bedroom: bedroomInt || undefined,
                price: {
                    gte: minPriceInt || undefined,
                    lte: maxPriceInt || undefined,
                },
            },
        });

        console.log(posts)
        res.status(200).json(posts);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get posts" });
    }
};
export const getPost = async (req, res) => {
    const id = req.params.id
    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                PostDetail: true,
                user: {
                    select: { username: true, avatar: true }
                }
            }
        })
        let userId;
        const token = req.cookies?.token;
        if (!token) {
            userId = null;
        } else {
            jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
                if (err) {
                    userId = null
                }
                userId = payload.id
            })
        }
        const savePost = await prisma.savedPost.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId: id,
                }
            }
        })
        res.status(200).json({ ...post, isSaved: savePost ? true : false })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "failed to get Post" })
    }
}
export const addPost = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;

    try {
        const newPost = await prisma.post.create({
            data: {
                ...body.postData,
                userId: tokenUserId,
                PostDetail: {
                    create: body.PostDetail,
                },
            },
        });
        res.status(200).json(newPost);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create post" });
    }
};
export const updatepost = async (req, res) => {
    try {
        res.status(200).json({ message: "" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "failed to update your Post" })
    }
}
export const deletePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    try {
        const post = await prisma.post.findUnique({
            where: { id }
        })

        if (post.userId !== tokenUserId) {
            return res.status(403).json({ message: "Not Authorized!" });
        }

        await prisma.post.deleteMany({
        });

        res.status(200).json({ message: "Post deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to delete post" });
    }
};