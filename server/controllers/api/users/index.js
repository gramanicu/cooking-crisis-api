"use strict"

import { Router } from "express"
import {
    createAccount,
    getUserByName,
    verifySignIn,
} from "../../../services/api/users"

let router = Router()

// GET ../users/exists/<username>
// Check if the user with the <username> name exists
router.get("/exists/:username", getUserMiddleware, async (req, res) => {
    // We know the user exists (because the "getUserMiddleware"
    // sends 404 message when the user doesn't exist)
    res.status(200).json({
        exists: true,
    })
})

// GET ../users/status/<username>
// Check the status of the user with the <username> name
router.get("/status/:username", getUserMiddleware, async (req, res) => {
    // We know the user exists (because the "getUserMiddleware"
    // sends 404 message when the user doesn't exist)
    res.status(200).json({
        status: res.user.status,
    })
})

// GET ../users/signin
// Login a user into it's account. The first request should have "move" flag
// (to change the device) set to false. When set to true, a new jwt token
// will be generated
router.get("/signin", async (req, res, next) => {
    try {
        const connected = await verifySignIn(
            req.body.username,
            req.body.password
        )

        if (connected) {
            res.status(200).json({
                success: {
                    message: "Login was successful",
                },
            })
        } else {
            res.status(400).json({
                error: {
                    message: "Username or password invalid",
                },
            })
        }
    } catch (err) {
        next(err)
    }
})

// POST ../users/new
// Signup a new user. The data is verified (send response if invalid).
// Creates the activation link and sends back success message signup successful
router.post("/new", async (req, res, next) => {
    try {
        const status = await createAccount(
            req.body.username,
            req.body.password,
            req.body.email
        )

        if (status.type == "error") {
            return res.status(409).json({ error: { message: status.message } })
        }

        // The account creation succeeded
        return res.status(201).json({ success: { message: status.message } })
    } catch (err) {
        next(err)
    }
})

// PATCH ../users/activation/<activation_link>
router.patch("/activation/:activation_id", async (req, res) => {})

// Middleware used in the routes that provide a ":username"
async function getUserMiddleware(req, res, next) {
    let user

    try {
        user = await getUserByName(req.params.username)

        if (user == null) {
            return res
                .status(404)
                .json({ error: { message: "Cannot find user" } })
        }
    } catch (err) {
        next(err)
    }

    res.user = user
    next()
}

export default router
