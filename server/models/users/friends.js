"use strict"

import pkg from "mongoose"
const { Schema, model } = pkg
import {
    friends_schema,
    friends_collection,
    friends_status,
    user_schema,
} from "../../constants/users"

const friendsSchema = new Schema({
    requester: { type: Schema.Types.ObjectId, ref: user_schema, unique: false },
    recipient: { type: Schema.Types.ObjectId, ref: user_schema, unique: false },
    status: { type: Number, default: friends_status.undefined },
})
friendsSchema.index({ requester: 1, recipient: 1 }, { unique: true })

export default model(friends_schema, friendsSchema, friends_collection)
