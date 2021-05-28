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
    requester: { type: Schema.Types.ObjectId, ref: user_schema },
    recipient: { type: Schema.Types.ObjectId, ref: user_schema },
    status: { type: Number, default: friends_status.undefined },
})

export default model(friends_schema, friendsSchema, friends_collection)
