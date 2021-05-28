import { Router } from "express"
import { send_request } from "../../../services/api/users/friends"
import {
    getJSON as getCacheJson,
    cacheJSON as setCacheJson,
} from "../../../middleware/caching"
import { authJWT } from "../../../middleware/users"
import { getUser as getUserMid } from "../../../middleware/users"

let router = Router()

// POST ../friends/add/:username
// Send a friend request to the user with the specified name
router.post("/add/:username", authJWT, getUserMid, async (req, res, next) => {
    try {
        const ret = await send_request(
            String(req.user_id),
            String(req.user._id)
        )

        if (ret.type != "error") {
            return res.status(201).json({
                res_status: "success",
                message: "Friend request sent",
            })
        } else {
            return res.status(400).json({
                res_status: "error",
                message: ret.message,
            })
        }
    } catch (err) {
        next(err)
    }
})

export default router
