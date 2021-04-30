"use strict"

import { Router } from "express"
import userControl from "../../../../controllers/api/users"

let router = Router()

// All the ".../users..." routes are managed by the user controller
router.all("*", userControl)

export default router
