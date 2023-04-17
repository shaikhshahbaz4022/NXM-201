const express = require('express');
const jwt = require('jsonwebtoken');
const postModel = require('../models/post.model');
const Authorization = require('../Middlewares/Authorization');
const Auth = require('../Middlewares/Auth');
require("dotenv").config()
const postRouter = express.Router()


postRouter.get("/",Auth, async (req, res) => {
    const token = req.cookies.accesstoken
    const decoded = jwt.verify(token, process.env.accessKey)
    try {
        if (decoded) {
            //finding by relationship 
            const data = await postModel.find({ "userID": decoded.userID })
            res.status(201).send(data)
        }
    } catch (error) {
        res.status(401).send({ "msg": error.message })
    }

})
postRouter.post("/add",Auth,Authorization(["user"]) , async (req, res) => {
    try {
        let post = new postModel(req.body)
        await post.save()
        res.status(201).send({ "msg": "Post Added Succesfully" })

    } catch (error) {
        res.status(401).send({ "msg": error.message })

    }
})
postRouter.patch("/update/:Id",Auth,Authorization(["user"]) , async (req, res) => {
    let { Id } = req.params
    const payload = req.body
    try {
        await postModel.findByIdAndUpdate({ _id: Id }, payload)
        res.status(201).send({ "msg": "Post Updated Succesfully" })

    } catch (error) {
        res.status(201).send({ "msg": "error while Updating  the post" })

    }
})
postRouter.delete("/delete/:Id",Auth,Authorization(["user"]) ,async (req, res) => {
    let { Id } = req.params

    try {
        await postModel.findByIdAndDelete({ _id: Id })
        res.status(201).send({ "msg": "Post Deleted Succesfully" })

    } catch (error) {
        res.status(201).send({ "msg": "error while deleting the post" })

    }
})

//Only Moderator can delete All Posts/Blogs
postRouter.delete("/deletebymoderator/:Id", Auth, Authorization(["Moderator"]), async (req, res) => {
    const {Id} = req.params
    try {
        await postModel.findByIdAndDelete({_id:Id})
        res.status(201).send({ "msg": "Post Deleted by moderator  Succesfully" })
    } catch (error) {
        res.status(201).send({ "msg": "error while deleting the post" })

    }
})

module.exports = postRouter