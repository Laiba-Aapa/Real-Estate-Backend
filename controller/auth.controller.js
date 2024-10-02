import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';


export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // hash the password
        const hashedPass = await bcrypt.hash(password, 10)
        // create the user and save to the database
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPass,
            }
        })
        console.log(newUser)
        res.status(201).json()
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to register User!" })
    }
}
export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if the user exists
        const user = await prisma.user.findUnique({
            where: { username }
        });
        // Log the user for debugging

        if (!user) {
            return res.status(401).json({ message: "Invalid Credentials!" });
        }

        // Check if the password is correct
        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) {
            return res.status(401).json({ message: "Invalid Credentials!" });
        }

        // Generate Cookie token and send to the user
        const age = 1000 * 60 * 60 * 24 * 7; // 7 days
        const token = jwt.sign({
            id: user.id,
        }, process.env.JWT_SECRET_KEY, { expiresIn: age });

        const { password: userPassword, ...userInfo } = user;
        res.cookie("token", token, {
            httpOnly: true,
            // secure: true, // Uncomment if using HTTPS
            maxAge: age,
        }).status(200).json(userInfo); // Fixed typo here

    } catch (err) {
        console.error("Login error:", err); // More descriptive error log
        res.status(500).json({ message: "Failed to Login!" });
    }
}

export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Logout successful!" })
}