import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    // if no token is available
    if (!token) return res.send(401).json({ message: "Not Authenticated!" })
    // if token is available
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) return res.status(403).json({ message: 'Token is not valid' })
        req.userId = payload.id
        next();
    })
}