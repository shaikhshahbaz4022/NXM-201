function Authorization(isvalidToken) {
    return function (req, res, next) {
        if (isvalidToken.includes(req.role)) {
            next()
        } else {
            res.status(401).send({ "msg": "You Are Not Authorized Person" })
        }
    }
}
module.exports = Authorization