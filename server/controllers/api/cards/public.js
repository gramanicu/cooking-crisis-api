"use strict"

import { Router } from "express"
import {
    getCardById,
    getAllCards
} from "../../../services/api/cards"
let router = Router()


router.get("/blah", async (req, res) => {
    return res.status(200).json({
        message: "niceeee",
    })
})

router.get("/view/:cardid", async (req, res) => {
    return res.status(200).json({
        test: getAllCards(),
    })

    try {
        const card = await getCardById(req.params.cardid)


        if (card == null) {
            let err = new Error("Card does not exist")
            err.status = 404
            return res.status(404).json({
                message: "Card not found",
            });
        }
    } catch (err) {
        return res.status(404).json({
            message: "Card not found",
        });
    }

    return res.status(200).json({
        card: card,
    })
})

export default router