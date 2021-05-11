// The "private" user routes
"use strict"

import { Router } from "express"
import {
    getUserByIdSafe,
    signOutAccount,
    changePassword,
} from "../../../services/api/users"
import {
    getJSON as getCacheJson,
    cacheJSON as setCacheJson,
} from "../../../middleware/caching"
import { authJWT } from "../../../middleware/users"

let router = Router()

// GET ../users/account
// Get data associated to the user account
router.get("/account", authJWT, async (req, res, next) => {
    try {
        const cache_key = "account_cache-" + req.user_id
        const account_data = await getCacheJson(cache_key)
        if (account_data) {
            // Return the existing access token
            return res.status(200).json(account_data)
        }

        const user = await getUserByIdSafe(req.user_id)
        setCacheJson(cache_key, user)
        return res.status(200).json(user)
    } catch (err) {
        next(err)
    }
})

// PATCH ../users/signout
// Signs the user out from his account. This removes the refresh token
// and updates his status.
router.patch("/signout", authJWT, async (req, res, next) => {
    const refresh_token = req.body.refresh_token

    if (refresh_token == null) {
        return res.status(401).json({
            res_status: "error",
            message: "Token not provided",
        })
    }

    try {
        const status = await signOutAccount(refresh_token)

        if (status.type == "error") {
            return res.status(401).json({
                res_status: "error",
                message: status.message,
            })
        }

        // The signout operation succeeded
        return res.status(201).json({
            res_status: "success",
            message: status.message,
        })
    } catch (err) {
        next(err)
    }
})

// PATCH ../users/password
// Updates the password of the user. The old password must be provided,
// and the new one must be entered two times.
router.patch("/password", authJWT, async (req, res, next) => {
    const old_password = req.body.old_password
    const new_password = req.body.new_password
    const repeated_password = req.body.repeated_password

    if (
        old_password == null ||
        new_password == null ||
        repeated_password == null
    ) {
        return res.status(401).json({
            res_status: "error",
            message: "Not all the required data was provided",
        })
    }

    try {
        if (new_password === repeated_password) {
            const status = await changePassword(
                req.user_id,
                old_password,
                new_password
            )

            if (status.type != "error") {
                return res.status(201).json({
                    res_status: "success",
                    message: status.message,
                })
            }

            return res.status(400).json({
                res_status: "error",
                message: status.message,
            })
        }
        return res.status(400).json({
            res_status: "error",
            message: "The passwords do not match",
        })
    } catch (err) {
        next(err)
    }
})

export default router
