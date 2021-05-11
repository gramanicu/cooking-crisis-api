// The "private" user routes
"use strict"

import { Router } from "express"
import {} from "../../../services/api/users"
import { authJWT } from "../../../middleware/users"

let router = Router()

// GET ../users/account
// Get data associated to the user account
router.get("/account", authJWT, async (req, res) => {
    console.log("WHAT")
    return res.sendStatus(200)
})

// PATCH ../users/signout
// Signs the user out from his account. This removes the refresh token
// and updates his status.
router.patch("/signout", authJWT, async (req, res) => {
    return res.sendStatus(200)
})

// PATCH ../users/password
// Updates the password of the user. The old password must be provided,
// and the new one must be entered two times.
router.patch("/password", authJWT, async (req, res) => {
    return res.sendStatus(200)
})

export default router
