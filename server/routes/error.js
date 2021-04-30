"use strict"

import { Router } from "express"
import errorController from "../controllers/error"

let router = Router()

router.use("/", errorController)

export default router
