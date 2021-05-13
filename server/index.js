"use strict"

import express, { json, urlencoded } from "express"
import { addAsync } from "@awaitjs/express"
import morgan from "morgan"
import routes_init from "./routes"
import cors_mw from "./middleware/cors"
import error_mw from "./middleware/errors"
import compression from "compression"
import helmet from "helmet"
import http from "http"
import { disconnectDB } from "./db"
import { disconnectRedis } from "./middleware/caching.js"

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
        this.server.use(compression())
        this.server.use(json())
        this.server.use(urlencoded({ extended: true }))
        this.server.use(helmet())

        this.server.use(morgan("dev"))

        // Initialize cors middleware
        this.server.use(cors_mw)

        // Initialize routes
        routes_init(this.server)

        // Initialize error handling middleware
        this.server.use(error_mw)
    }

    shutdown_sv = async () => {
        console.log("")
        await disconnectDB()
        await disconnectRedis()
        this.http_sv.close(() => {
            console.log("Shutting down...")
            process.exit()
        })
    }

    start = () => {
        let hostname = this.server.get("hostname")
        let port = this.server.get("port")

        this.http_sv = http
            .createServer(this.server)
            .listen(port, () => {
                console.log("Express server started on: " + hostname)
            })
            .on("error", (e) => {
                // Print message to stderr and stop the server
                console.error(
                    e.name + " occurred during express init: ",
                    e.message
                )

                this.shutdown_sv()
            })

        process.on("SIGTERM", this.shutdown_sv)
        process.on("SIGINT", this.shutdown_sv)
        process.on("uncaughtException", this.shutdown_sv)
        process.on("unhandledRejection", this.shutdown_sv)
    }

    get expressServer() {
        return this.server
    }
}
