"use strict"

import { Router } from "express"
import {
    getUserWithId,
    getUserWithName,
    getUserWithEmail,
} from "../../../services/api/users"

let router = Router()

// The get route for ".../query?<query params>". For example, ".../query?name=user
router.get("/query", (req, res) => {
    const name = req.query.name
    const email = req.query.email
    const id = req.query.id

    if (typeof name !== "undefined" && name) {
        console.log(getUserWithName(name))
    }
})

export default router
