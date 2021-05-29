"use strict"

import { Server } from "socket.io"
import { init_routes } from "./routes/sockets"

export let io

export function init(http_sv) {
    io = new Server(http_sv, {
        path: "/sockets/",
        cors: {
            origin: "*",
        },
    })

    init_routes(io)
    io.on("connect_error", (err) => {
        console.log(`Socket connect_error due to ${err.message}`)
    })
}
