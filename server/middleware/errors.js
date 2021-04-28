"use strict"

export default (err, req, res, next) => {
    res.status(err.statusCode)
    res.redirect("/error")

    return res
}
