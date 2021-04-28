"use strict"

import errorMw from "./errors"

/**
 * Initializes the middleware
 * @param {} server The (express) server that will use the middleware
 */
export default (server) => {
    server.use(errorMw)
}
