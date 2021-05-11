// The "public" user routes
"use strict"

import { Router } from "express"
import {
    createAccount,
    verifySignIn,
    activateAccount,
    refreshAccessToken,
} from "../../../services/api/users"
import { getUser as getUserMiddleware } from "../../../middleware/users"
import { routeCacheMiddleware } from "../../../middleware/caching"
import { jwt_access_expiry_time } from "../../../constants/utils"

let router = Router()

// GET ../users/exists/<username>
// Check if the user with the <username> name exists
router.get(
    "/exists/:username",
    routeCacheMiddleware,
    getUserMiddleware,
    async (req, res) => {
        // We know the user exists (because the "getUserMiddleware"
        // sends 404 message when the user doesn't exist)
        return res.status(200).json({
            exists: true,
        })
    }
)

// GET ../users/status/<username>
// Check the status of the user with the <username> name
router.get("/status/:username", getUserMiddleware, async (req, res) => {
    // We know the user exists (because the "getUserMiddleware"
    // sends 404 message when the user doesn't exist)
    return res.status(200).json({
        res_status: req.user.status,
    })
})

// POST ../users/signin
// Login a user into it's account. The first request should have "move" flag
// (to change the device) set to false. When set to true, a new jwt token
// will be generated
router.post("/signin", async (req, res, next) => {
    const username = req.body.username
    const password = req.body.password

    if (username == null || password == null) {
        return res.status(401).json({
            res_status: "error",
            message: "Username or password were not provided",
        })
    }

    try {
        const status = await verifySignIn(username, password)

        if (status.type == "success") {
            return res.status(200).json({
                res_status: "success",
                message: status.message,
                jwt_access_token: status.access_token,
                jwt_refresh_token: status.refresh_token,
                access_expiry: jwt_access_expiry_time,
            })
        } else {
            return res.status(401).json({
                error: {
                    message: status.message,
                },
            })
        }
    } catch (err) {
        next(err)
    }
})

// GET ../users/token
// Creates a new access token based on the access token
router.get("/token", async (req, res, next) => {
    const refresh_token = req.body.refresh_token

    if (refresh_token == null) {
        return res.status(401).json({
            res_status: "error",
            message: "Token not provided",
        })
    }

    try {
        const status = await refreshAccessToken(refresh_token)
        if (status.type == "error") {
            return res.status(403).json({
                res_status: "error",
                message: "Inexistent token",
            })
        }

        // The account creation succeeded
        return res.status(200).json({
            res_status: "success",
            message: status.message,
            jwt_access_token: status.access_token,
            access_expiry: jwt_access_expiry_time,
        })
    } catch (err) {
        next(err)
    }
})

// POST ../users/new
// Signup a new user. The data is verified (send response if invalid).
// Creates the activation link and sends back success message signup successful
router.post("/new", async (req, res, next) => {
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email

    if (username == null || password == null || email == null) {
        return res.status(400).json({
            res_status: "error",
            message: "Username, password or email was not provided",
        })
    }

    try {
        const status = await createAccount(username, password, email)

        if (status.type == "error") {
            return res.status(409).json({
                res_status: "error",
                message: status.message,
            })
        }

        // The account creation succeeded
        return res.status(201).json({
            res_status: "success",
            message: status.message,
        })
    } catch (err) {
        next(err)
    }
})

// GET ../users/activation/<activation_link>
router.get("/activation/:activation_id", async (req, res, next) => {
    const activation_id = req.params.activation_id

    if (activation_id == null) {
        return res.status(404).json({
            res_status: "error",
            message: "Activation id was not provided",
        })
    }

    try {
        const status = await activateAccount(activation_id)
        if (status.type == "error") {
            return res.status(404).json({
                res_status: "error",
                message: status.message,
            })
        }

        // The email activation succeeded
        return res.status(201).json({
            res_status: "success",
            message: status.message,
        })
    } catch (err) {
        next(err)
    }
})

export default router
