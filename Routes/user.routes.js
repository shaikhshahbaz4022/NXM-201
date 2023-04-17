const express = require('express');
const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BlacklistModel = require('../models/Blacklist');
require("dotenv").config()
const userRouter = express.Router()

//Register Route

userRouter.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body
        const userPresent = await UserModel.findOne({ email })
        if (userPresent) {
            return res.status(401).send({ "msg": "Already Registered,continue Login" })
        }
        bcrypt.hash(password, 3, async function (err, hash) {
            const user = new UserModel({ name, email, password: hash, role })
            await user.save()
            res.status(201).send({ "msg": "registration Succesfull" })

        });

    } catch (error) {
        return res.status(401).send({ "msg": error.message })

    }
})
//login Route
userRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const userPresent = await UserModel.findOne({ email })
        if (!userPresent) {
            return res.status(401).send({ "msg": "Please Signup first " })

        }
        const isPasswordCorrect = bcrypt.compareSync(password, userPresent.password);
        if (!isPasswordCorrect) {
            return res.status(401).send({ "msg": "Wrong credentials" })
        }

        const accesstoken = jwt.sign({
            email,
            "role": userPresent.role,
            "userID": userPresent._id
        }, process.env.accessKey, { expiresIn: "1m" });
        const refreshtoken = jwt.sign({
            email,
            "role": userPresent.role,
            "userID": userPresent._id
        }, process.env.refreshKey, { expiresIn: "3m" });
        res.cookie("accesstoken", accesstoken, { maxAge: 60 * 1000 * 10 })
        res.cookie("refreshtoken", refreshtoken, { maxAge: 60 * 1000 * 20 })
        res.status(201).send({ "msg": "login Succesfull", accesstoken, refreshtoken })


    } catch (error) {
        return res.status(401).send({ "msg": error.message })

    }
})

// logout Route storing into Database
userRouter.post("/logout", async (req, res) => {
    try {
        const accesstoken = req.cookies.accesstoken
        const refreshtoken = req.cookies.refreshtoken;

        const Blacklist_AccessToken = new BlacklistModel({ token: accesstoken })
        const Blacklist_RefreshToken = new BlacklistModel({ token: refreshtoken })
        await Blacklist_AccessToken.save()
        await Blacklist_RefreshToken.save()
        res.status(201).send({ "msg": "Logout Succesfully" })
    } catch (error) {
        return res.status(401).send({ "msg": error.message })

    }
})
module.exports = userRouter