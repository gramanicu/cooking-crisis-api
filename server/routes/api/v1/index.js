"use strict"

import { Router } from "express"
import userRoute from "./users"
import leaderboardRoute from "./leaderboard"

let router = Router()

router.use("/users", userRoute)
router.use("/leaderboard", leaderboardRoute)

export default router
