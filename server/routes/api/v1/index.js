"use strict"

import { Router } from "express"
import userRoute from "./users"
import leaderboardRoute from "./leaderboard"
import matchesRoute from "./matches"
import cardRoute from "./cards"

let router = Router()

router.use("/users", userRoute)
router.use("/leaderboard", leaderboardRoute)
router.use("/matches", matchesRoute)
router.use("/cards", cardRoute)

export default router
