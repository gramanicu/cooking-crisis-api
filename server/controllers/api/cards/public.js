"use strict"

import { Router } from "express"
import {
    getCardById,
    getAllCards
} from "../../../services/api/cards"
let router = Router()


router.get("/view", async (req, res, next) => {
    try {
        const cards = await getAllCards()
        let message = "All cards returned"

        if (cards.length == 0) {
            message = "No cards found"
        }

        return res.status(200).json({
            res_status: "success",
            message: message,
            cards: cards,
        })
    } catch(err) {
        next(err)
    }
})

router.get("/view/:cardid", async (req, res, next) => {
    try {
        const card = await getCardById(req.params.cardid)

        if (card == null) {
            let err = new Error("Card does not exist")
            err.status = 404
            return res.status(404).json({
                res_status: "error",
                message: "Card not found",
            });
        }

        return res.status(200).json({
            res_status: "success",
            message: "Card found",
            card: card,
        })
    } catch (err) {
        next(err)
    }
})

export default router