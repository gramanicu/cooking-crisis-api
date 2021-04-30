"use strict"

import { Router } from "express"
import { userExists } from "../../../services/api/users"

let router = Router()

// GET ../users/exists/<username></username>
// Check if the user with the <username> name exists
router.get("/exists/:username", async (req, res) => {
    if (req.params.username) {
        const exists = await userExists(req.params.username)

        if (exists) {
            res.send("true")
        } else {
            res.send("false")
        }
    }
})

// GET ../users/status/<username>
router.get("/status/:username", async (req, res) => {})

// GET ../users/signin
router.get("/signin", async (req, res) => {})

// POST ../users/new
router.post("/new", async (req, res) => {})

// PATCH ../users/activation/<activation_link>
router.patch("/activation/:activation_id", async (req, res) => {})

export default router
