"use strict"

export default (err, req, res, next) => {
    res.status(err.status || 500)

    if (err instanceof SyntaxError) {
        res.status(400)
        res.json({
            error: {
                message: "Bad request",
            },
        })

        console.error(err)
    } else if (err.status && err.status != 404) {
        res.json({
            error: {
                message: err.message,
            },
        })

        console.error(err)
    } else if (err.status == 404) {
        res.json({
            error: {
                message: err.message,
            },
        })
    } else {
        res.json({
            error: {
                message: "Internal server error",
            },
        })

        console.error(err)
    }
}
