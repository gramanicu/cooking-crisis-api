"use strict"

import { Router } from "express"
import { userExists, userStatus } from "../../../services/api/users"

let router = Router()

// GET ../users/exists/<username>
// Check if the user with the <username> name exists
router.get("/exists/:username", async (req, res) => {
    const exists = await userExists(req.params.username)

    res.json({
        username: req.params.username,
        exists: exists,
    })
})

// GET ../users/status/<username>
// Check the status of the user with the <username> name
router.get("/status/:username", async (req, res) => {
    const status = await userStatus(req.params.username)

    res.json({
        username: req.params.username,
        status: status,
    })
})

// GET ../users/signin
router.get("/signin", async (req, res) => {})

// POST ../users/new
router.post("/new", async (req, res) => {})

// PATCH ../users/activation/<activation_link>
router.patch("/activation/:activation_id", async (req, res) => {})

export default router
