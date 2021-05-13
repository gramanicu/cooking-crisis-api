"use strict"

import server from "./server"
import config from "./configs"
import db from "./server/db"

// Wait for the db to be connected before anything else
db(config.mongoose_uri)
    .then(() => {
        // Init and start the express server
        const sv = new server(config)
        sv.start()
    })
    .catch((err) => {
        console.error("Error " + err + " encountered, server will close")
        process.exit()
    })
