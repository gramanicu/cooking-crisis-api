"use strict"

import apiRoute from "./api"
import docsRoute from "./docs"
import errorRoute from "./error"

/**
 * Initializes the router
 * @param {} server The (express) server that will use the routes
 */
export default (server) => {
    server.use("/api", apiRoute)
    server.use("/docs", docsRoute)
    server.use("/error", errorRoute)
}
