// The "private" matches routes
"use strict"

import { Router } from "express"
import {
    getMatchById
} from "../../../services/api/matches"
let router = Router()

// GET ../matches/view/<matchId>
// Get match information
router.get("/view/:matchid", async (req, res) => {
    // TODO check for authorization
    try {
        const match = await getMatchById(req.params.username)

        if (match == null) {
            let err = new Error("Match does not exist")
            err.status = 404
            return res.status(404).json({
                res_status: "error",
                message: "Match not found",
            });
        }
    } catch (err) {
        return res.status(404).json({
            res_status: "error",
            message: "Match not found",
        });
    }

    return res.status(200).json({
        "res_status": "success",
        "message": "Match found",
        match: match,
    })
})




// // POST ../matches/new
// // Store a ended match
// router.post("/new", async (req, res, next) => {
//     // get data
//     const player1_id = req.body.player1_id
//     const player2_id = req.body.player2_id
//     const is_winner_first = req.body.is_winner_first
//     const chat_history = req.body.chat_history

//     // data validation
//     if (username == null || password == null || email == null) {
//         return res.status(400).json({
//             res_status: "error",
//             message: "Username, password or email was not provided",
//         })
//     }

//     // add data to db
//     try {
//         const status = await createAccount(username, password, email)

//         if (status.type == "error") {
//             return res.status(409).json({
//                 res_status: "error",
//                 message: status.message,
//             })
//         }

//         // The account creation succeeded
//         return res.status(201).json({
//             res_status: "success",
//             message: status.message,
//         })
//     } catch (err) {
//         next(err)
//     }
// })

export default router
