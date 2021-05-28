"use strict"

import { Router } from "express"
import friendsControl from "../../../../controllers/api/friends"

let router = Router()

// All the ".../friends..." routes are managed by the friends controller
router.all("*", friendsControl)

export default router
