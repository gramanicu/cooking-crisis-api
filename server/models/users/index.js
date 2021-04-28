import { Schema, model } from "mongoose"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    isActive: {
        type: Boolean,
        required: false,
        default: false,
    },

    isAdmin: {
        type: Boolean,
        required: false,
        default: false,
    },
})

module.exports = model("user", userSchema)
