const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ["User", "Moderator"],
        default: "User"
    }
})
const UserModel = mongoose.model("user", userSchema)
module.exports = UserModel