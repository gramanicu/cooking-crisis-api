"use strict"

function _index_v1(req, res, next) {
    // Send an actual API documentation
    res.sendFile("Readme.md", { root: "." }, function (err) {
        if (err) {
            next(err)
        }
    })
}

export const index_v1 = _index_v1
