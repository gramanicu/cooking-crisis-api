"use strict"

import pkg from "mongoose"
const { Schema, model } = pkg
import { user_collection, user_schema } from "../../constants/users"

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    // The number is associated to a user_status from constants
    status: {
        type: Number,
        required: true,
    },

    elo: {
        type: Number,
        required: true,
    },

    isAdmin: {
        type: Boolean,
        required: false,
        default: false,
    },
})

export default model(user_schema, userSchema, user_collection)
