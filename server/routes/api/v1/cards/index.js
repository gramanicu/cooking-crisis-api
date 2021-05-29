"use strict"

import { Router } from "express"
import cardsControl from "../../../../controllers/api/cards"

let router = Router()

// All the ".../cards..." routes are managed by the matches controller
router.all("*", cardsControl)

export default router