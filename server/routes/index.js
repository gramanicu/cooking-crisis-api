'use strict';

import apiRoute from './apis'
import docsRoute from './docs'
import errorRoute from './error'

/**
 * Initializes the router
 * @param {} server 
 */
 export default function init(server) {
    server.get('*', function (req, res, next) {
        console.log('Request was made to: ' + req.originalUrl)
        return next();
    })

    server.get('/', function (req, res) {
        res.redirect('/docs/v1')
    })

    server.use('/api', apiRoute)
    server.use('/docs', docsRoute)
    server.use('/error', errorRoute)
}