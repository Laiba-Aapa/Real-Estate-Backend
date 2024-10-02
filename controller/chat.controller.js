import prisma from "../utils/prisma.js"
export const getChats = async (req, res) => {
    const tokenUserId = req.userId;
    try {
        const chats = await prisma.chat.findMany({
            where: {
                userIDs: {
                    hasSome: [tokenUserId]
                }
            }
        })
        // get the user details
        for (const chat of chats) {
            const recieverId = chat.userIDs.find((id) => id !== tokenUserId)
            // get reciever data from database
            const reciever = await prisma.user.findUnique({
                where: {
                    id: recieverId,
                },
                select: {
                    id: true,
                    username: true,
                    avatar: true
                }
            })
            chat.reciever = reciever;
        }
        res.status(200).json(chats)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "failed to get chats" })
    }
}
export const getChat = async (req, res) => {
    const tokenUserId = req.userId;
    try {
        const chat = await prisma.chat.findUnique({
            where: {
                id: req.params.id,
                userIDs: {
                    hasSome: [tokenUserId]
                }
            },
            include: {
                message: {
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        })
        await prisma.chat.update({
            where: {
                id: req.params.id,
            },
            data: {
                seenBy: {
                    push: [tokenUserId],
                },
            },
        });
        res.status(200).json(chat)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "failed to get chat" })
    }
}
export const addChat = async (req, res) => {
    const tokenUserId = req.userId;
    try {
        const newChat = await prisma.chat.create({
            data: {
                userIDs: [tokenUserId, req.body.recieverId]
            }
        })
        res.status(200).json(newChat)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "failed to add chat" })
    }
}
export const readChat = async (req, res) => {
    const tokenUserId = req.userId;
    try {
        const Chat = await prisma.chat.update({
            where: {
                id: req.params.id,
                userIDs: {
                    hasSome: [tokenUserId]
                }
            },
            data: {
                seenBy: {
                    set: [tokenUserId],
                }
            }
        })
        res.status(200).json(Chat)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "failed to read chat" })
    }
}