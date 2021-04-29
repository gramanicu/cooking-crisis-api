"use strict"

import express, { json, urlencoded } from "express"
import routes_init from "./routes"
import mw_init from "./middleware"

export default class Server {
    constructor(config) {
        // Singleton
        if (Server._instance) {
            return Server._instance
        }
        Server._instance = this

        this.server = express()

        // Server settings
        this.server.set("env", config.env)
        this.server.set("port", config.port)
        this.server.set("hostname", config.hostname)

        // Middleware init
        this.server.use(json())
        this.server.use(urlencoded({ extended: true }))

        // Initialize routes
        routes_init(this.server)

        // Initialize custom middleware
        mw_init(this.server)
    }

    start = () => {
        let hostname = this.server.get("hostname")
        let port = this.server.get("port")

        this.server
            .listen(port, () => {
                console.log("Express server listening port: " + port)
            })
            .on("error", (e) => {
                // Print message to stderr and stop the server
                console.error(
                    e.name + " occurred during express init: ",
                    e.message
                )
                process.exit()
            })
    }

    get expressServer() {
        return this.server
    }
}
