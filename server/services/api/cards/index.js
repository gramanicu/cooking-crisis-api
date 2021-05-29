"use strict"

import cardModel from "../../../models/cards";

export async function getCardById(id) {
    try {
        const card = await cardModel.findById(id)
        return card._doc
    } catch (err) {
        throw new Error(err)
    }
};


export async function getAllCards() {
    try {
        const cards = await cardModel.find({});
        return cards;
    } catch(err) {
        throw new Error(err)
    }
}