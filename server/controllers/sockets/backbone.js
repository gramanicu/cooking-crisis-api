"use strict"

import { authSocketJWT } from "../../middleware/users"
import { send_notification } from "../../services/sockets/backbone"
import { getUserByIdSafe } from "../../services/api/users"

export default function (io) {
    io.use(authSocketJWT)

    io.on("connection", async (socket) => {
        // Create a link to the client, to be able to send direct messages
        socket.join(socket.user_id)

        // The answer to a ping (pong). Used by the client to measure delay
        socket.on("ping", (time) => {
            socket.emit("pong", time)
        })
    })
}
