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
        cardModel.count({}, function(err, count){
            return {count: count};
        });


        // cardModel.find({}, (err, cards) => {
        //     var cardMap = {}

        //     cards.forEach( card => (cardMap[card._id] = card))

        //     return cardMap;
        // })


    } catch(err) {
        throw new Error(err)
    }
}