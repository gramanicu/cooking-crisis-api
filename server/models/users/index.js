import pkg from "mongoose"
const { Schema, model } = pkg

const userSchema = new Schema(
    {
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
    },
    { collection: "users" }
)

export default model("user", userSchema)
