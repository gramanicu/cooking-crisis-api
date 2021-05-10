// All the controllers used for the "./users" route
"use strict"

import { Router } from "express"
import public_controllers from "./public"
import private_controllers from "./private"

let router = Router()

router.all("*", public_controllers)
router.all("*", private_controllers)

export default router
