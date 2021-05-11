"use strict"

import { Router } from "express"
import matchesControl from "../../../../controllers/api/matches"

let router = Router()

// All the ".../matches..." routes are managed by the matches controller
router.all("*", matchesControl)

export default router
