"use strict"

export default async function (err, req, res, next) {
    res.status(err.status || 500)

    if (err instanceof SyntaxError) {
        console.error(err)
        return res.status(400).json({
            error: {
                req_status: "error",
                message: "Bad request",
            },
        })
    } else if (err.status) {
        return res.json({
            error: {
                req_status: "error",
                message: err.message,
            },
        })
    } else {
        console.error(err)
        return res.json({
            error: {
                req_status: "error",
                message: "Internal server error",
            },
        })
    }
}
