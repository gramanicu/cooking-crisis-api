"use strict"

import { Router } from "express"
import leaderboardControl from "../../../../controllers/api/leaderboard"

let router = Router()

// All the ".../users..." routes are managed by the user controller
router.get("/test", leaderboardControl)
router.get("*", leaderboardControl)

export default router
