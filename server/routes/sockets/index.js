"use strict"

import backbone_control from "../../controllers/sockets/backbone"
import match_control from "../../controllers/sockets/match"

export function init_routes(io) {
    backbone_control(io.of("/backbone"))
    match_control(io.of("/match"))
}
