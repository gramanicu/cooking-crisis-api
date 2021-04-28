"use strict"

import { Router } from "express"
import v1Router from "./v1"
// const v2ApiController = require('./v2')

let router = Router()

router.use("/v1", v1Router)
// router.use('/v2', v2ApiController);

export default router
