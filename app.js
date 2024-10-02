import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors';


const app = express();
import PostRoute from './routes/post.route.js'
import userRoute from './routes/user.route.js'
import authRoute from './routes/auth.route.js'
import testRoute from './routes/test.route.js'
import chatRoute from './routes/chat.route.js'
import messageRoute from './routes/message.route.js'

const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Ensure no trailing slash here
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // If you want to allow cookies or authentication headers
};

const port = process.env.PORT || 8800

app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser())

app.use("/api/posts", PostRoute)
app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/test", testRoute)
app.use("/api/chats", chatRoute)
app.use("/api/messages", messageRoute)

console.log('testing')
app.listen(port)