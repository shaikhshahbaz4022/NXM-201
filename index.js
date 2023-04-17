const express = require('express');
const connection = require('./connection/connection');
const userRouter = require('./Routes/user.routes');
const cookieParser = require('cookie-parser');
const Auth = require('./Middlewares/Auth');
const postRouter = require('./Routes/post.routes');
require("dotenv").config()
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use("/user", userRouter)

app.use("/post", postRouter)

app.listen(process.env.PORT, async () => {
    try {
        await connection
        console.log("Connected to database Succesfully");
    } catch (error) {
        console.log(error);
        console.log("Error while connecting to DB");
    }
    console.log("Server is connected to port no 6700");
})