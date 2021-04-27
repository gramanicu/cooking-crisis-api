'use strict'

import express, { json, urlencoded } from 'express'
import routes_init from './routes'

export default function() {
    // Private variable
    let server = express()

    // Public functions
    let create, start

    create = function(config) {

        // Server settings
        server.set('env', config.env)
        server.set('port', config.port)
        server.set('hostname', config.hostname)

        // Built-in middleware that parses json payloads
        server.use(json())

        // Built-in middleware that parses urlencoded payloads
        server.use(urlencoded({ extended: true }))

        // Initialize the routes for this server
        routes_init(server)
    }

    start = function() {
        let hostname = server.get('hostname')
        let port = server.get('port')
        
        server.listen(port, function() {
            console.log('Express server listening on - http://' + hostname + ':' + port)
        })
    }

    // The functions that are exported
    return {
        create: create,
        start: start
    }
}

