"use strict"

import { Router } from "express"

let router = Router()

// The get route for ".../query?<query params>". For example, ".../query?name=user
router.get("/:id", (req, res) => {
    res.send("test");
})




export default router
