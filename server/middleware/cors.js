"use strict"

export default (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )

    // Sent by the browser first, before a POST, PUT,
    // etc. to know what options are available
    if (req.method === "OPTIONS") {
        // Send back the methods accepted by the API
        res.header(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, PATCH, DELETE, GET"
        )

        // Return immediately
        return res.status(200).json({})
    }

    next()
}
