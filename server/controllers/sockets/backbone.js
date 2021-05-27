"use strict"

import { authSocketJWT } from "../../middleware/users"

export default function (io) {
    io.use(authSocketJWT)

    io.on("connection", (socket) => {
        console.log("User " + socket.user_id + " connected to the backbone")
    })

    io.on("ping", (socket) => {})
}
