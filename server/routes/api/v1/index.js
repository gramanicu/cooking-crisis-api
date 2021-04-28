"use strict"

import { Router } from "express"
import indexControl from "../../../controllers/api"
import userRoute from "./users"

let router = Router()

router.get("/", indexControl)
router.use("/users", userRoute)

export default router
