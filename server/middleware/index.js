"use strict"

import errorMw from "./errors"
import corsMw from "./cors"

/**
 * Initializes the middleware
 * @param {} server The (express) server that will use the middleware
 */
export default (server) => {
    server.use(corsMw)
    server.use(errorMw)
}
