"use strict"

import apiRoute from "./api"
import docsRoute from "./docs"
import errorRoute from "./error"

/**
 * Initializes the router
 * @param {} server The (express) server that will use the routes
 */
export default (server) => {
    server.get("/", function (req, res) {
        // Redirect to the newest documentation
        res.redirect("/docs/v1")
    })

    server.use("/api", apiRoute)
    server.use("/docs", docsRoute)
    server.use("/error", errorRoute)

    server.get("*", function (req, res, next) {
        // Invalid routes are redirected to home. TODO - decide wether or not it should actually return an error, using the error middleware
        res.redirect("/")
    })
}
