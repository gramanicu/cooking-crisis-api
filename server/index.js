"use strict"

import express, { json, urlencoded } from "express"
import routes_init from "./routes"
import mw_init from "./middleware"
import mongoose from "mongoose"

export default function () {
    // Private variable
    let server = express()

    // Public functions
    let create, start

    create = function (config) {
        // Server settings
        server.set("env", config.env)
        server.set("port", config.port)
        server.set("hostname", config.hostname)
        server.set("mongoose-uri", config.mongoose_uri)

        // Built-in middleware that parses json payloads
        server.use(json())

        // Built-in middleware that parses urlencoded payloads
        server.use(urlencoded({ extended: true }))

        // Initialize the routes for this server
        routes_init(server)

        // Initialize the middleware for this server
        mw_init(server)
    }

    start = function () {
        let hostname = server.get("hostname")
        let port = server.get("port")

        server.listen(port, function () {
            console.log(
                "Express server listening on - http://" + hostname + ":" + port
            )
        })

        try {
            mongoose.connect(
                server.get("mongoose-uri"),
                { useNewUrlParser: true, useUnifiedTopology: true },
                () => console.log("Connected to the database")
            )
        } catch (error) {
            console.log("Could not connect to the database")
        }
    }

    // The functions that are exported
    return {
        create: create,
        start: start,
    }
}
