"use strict"

import pkg from "mongoose"
const { Schema, model } = pkg

const cardsSchema = new  Schema({
    key: String,
    name: String,
    image: String,
    type: Number,
    minion_type: Number,
    class: Number,
    cost: Number,
    hp: Number,
    attack: Number,
})

export default model("card", cardsSchema, "cards")