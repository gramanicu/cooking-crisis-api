import { Schema, model } from "mongoose"
import { user_collection, user_schema } from "../../constants/users"

const userSchema = new Schema({
    name: {
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

    status: {
        type: String,
        required: true,
    },

    isAdmin: {
        type: Boolean,
        required: false,
        default: false,
    },
})

export default model(user_schema, userSchema, user_collection)
