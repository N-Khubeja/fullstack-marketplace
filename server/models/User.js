const mongoose = require("mongoose")

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    device: {
        type: String,
        default: "unknown"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    refreshTokens: {
        type: [refreshTokenSchema],
        default: []
    },
    icon: {
        type: {
            url: {
                type: String
            },
            publicId: {
                type: String
            }
        },
        default: null
    },
    passwordResetToken: {
    type: String,
    default: null,
    },
    passwordResetExpires: {
        type: Date,
        default: null,
    }
})

module.exports = mongoose.model("User",userSchema)