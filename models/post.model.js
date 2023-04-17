const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    title: String,
    sub: String,
    body: String,
    userID : String
   
})
const postModel = mongoose.model("post", postSchema)
module.exports = postModel