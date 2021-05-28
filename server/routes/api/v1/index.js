"use strict"

import { Router } from "express"
import userRoute from "./users"
import friendsRoute from "./friends"
import leaderboardRoute from "./leaderboard"

let router = Router()

router.use("/users", userRoute)
router.use("/friends", friendsRoute)
router.use("/leaderboard", leaderboardRoute)

export default router
