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
        // TODO - handle errors better (middleware, idk), send a error response
        getUserWithName(name)
            .then((doc) => {
                res.send(doc)
            })
            .catch((error) => console.log(error.message))
    }
})

export default router
