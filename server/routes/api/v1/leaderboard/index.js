"use strict"

import { Router } from "express"
import leaderboardControl from "../../../../controllers/api/leaderboard"

let router = Router()

// All the ".../leaderboard..." routes are managed by the leaderboard controller
router.use("*", leaderboardControl)

export default router
