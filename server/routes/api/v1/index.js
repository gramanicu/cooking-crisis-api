"use strict"

import { Router } from "express"
import indexControl from "../../../controllers/api"
import userRoute from "./users"
import leaderboardRoute from "./leaderboard"

let router = Router()

router.get("/", indexControl)
router.use("/users", userRoute)
router.use("/leaderboard", leaderboardRoute)


export default router
