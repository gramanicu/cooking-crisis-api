"use strict"

import { getUserByName } from "../services/api/users"
import jwt from "jsonwebtoken"
import config from "../../configs"

// Middleware that tries to get a :username param from a request
// and then search for that user in the DB. If the user is found,
// his account data is stored in the "res"
export async function getUser(req, res, next) {
    const username = req.params.username

    if (username == null) {
        return res.status(400)
    }

    try {
        const user = await getUserByName(username)

        if (user == null) {
            return res.status(404)
        }

        req.user = user
        next()
    } catch (err) {
        next(err)
    }
}

export async function authJWT(req, res, next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (token == null) {
        return res.status(401)
    }

    try {
        const user = jwt.verify(token, config.jwt_access_secret)
        req.user_id = user._id
        next()
    } catch (err) {
        next(err)
    }
}