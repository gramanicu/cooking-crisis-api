"use strict"

import pkg from "mongoose"
const { Schema, model } = pkg
import { user_schema } from "../../constants/users"
import { match_schema, match_collection } from "../../constants/matches"

const matchesSchema = new Schema({
    /*
        The _id is automatically created, so we don't 
        need a match_id property
         */
    player1_id: {
        type: Schema.Types.ObjectId,
        ref: user_schema,
        required: true,
    },
    player2_id: {
        type: Schema.Types.ObjectId,
        ref: user_schema,
        required: true,
    },
    isWinnerFirst: {
        type: Number,
        required: false,
    },
    chatHistory: {
        type: Array,
        required: false,
    },
})

export default model(match_schema, matchesSchema, match_collection)
