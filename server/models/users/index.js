"use strict"

import pkg from "mongoose"
const { Schema, model } = pkg
import {
    user_collection,
    user_schema,
    user_status,
} from "../../constants/users"
import { activation_expiry_time, starting_elo } from "../../constants/utils"

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    lowercase_name: {
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
        default: user_status.offline,
    },

    elo: {
        type: Number,
        required: true,
        default: starting_elo,
    },

    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },

    created_at: {
        type: Date,
        default: Date.now,
    },

    refresh_token: {
        type: String,
        required: false,
    },

    activated: {
        type: Boolean,
        required: false,
        default: false,
    },

    activation_token: {
        type: String,
        required: false,
    },

    activation_expiry: {
        type: Date,
        required: false,
        default: () => new Date(+new Date() + activation_expiry_time),
    },
})

export default model(user_schema, userSchema, user_collection)
