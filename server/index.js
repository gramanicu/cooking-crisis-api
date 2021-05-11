"use strict"

import express, { json, urlencoded } from "express"
import { addAsync } from "@awaitjs/express"
import morgan from "morgan"
import routes_init from "./routes"
import mw_init from "./middleware"
import cors from "./middleware/cors"

export default class Server {
    constructor(config) {
        // Singleton
        if (Server._instance) {
            return Server._instance
        }
        Server._instance = this

        // Asynchronous express
        this.server = addAsync(express())

        // Server settings
        this.server.set("env", config.env)
        this.server.set("port", config.port)
        this.server.set("hostname", config.hostname)

        // Middleware init
        this.server.use(json())
        this.server.use(urlencoded({ extended: true }))

        this.server.use(morgan("dev"))
        this.server.use(cors)

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
                console.log("Express server started on: " + hostname)
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
