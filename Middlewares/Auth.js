const jwt = require('jsonwebtoken');
const BlacklistModel = require('../models/Blacklist');
require("dotenv").config()

async function Auth(req, res, next) {
    let validToken = req.cookies.accesstoken

    let checkblacklistToken = await BlacklistModel.findOne({ token: validToken })
    if (checkblacklistToken) {
        return res.status(401).send({ "msg": "Please Login Again" })

    }
    if (validToken) {
        var decoded = jwt.verify(validToken, process.env.accessKey);
        const role = decoded.role
        req.role = role


        if (decoded) {


            //establishing relationship between user and posts
            req.body.userID = decoded.userID

            next()
        } else {
            res.status(401).send({ "msg": "Invalid Access Token" })

        }
    } else {
        res.status(401).send({ "msg": "Access Token Not Found" })

    }
}
module.exports = Auth