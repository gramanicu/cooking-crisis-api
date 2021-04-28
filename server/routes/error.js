"use strict"

import { Router } from "express"
import errorController from "../controllers/error"

let router = Router()

router.get("/", errorController)

export default router
