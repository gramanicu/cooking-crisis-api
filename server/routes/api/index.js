"use strict"
// This is the router for different versions of the api.

import { Router } from "express"
import v1Router from "./v1"

let router = Router()

router.use("/v1", v1Router)

export default router
