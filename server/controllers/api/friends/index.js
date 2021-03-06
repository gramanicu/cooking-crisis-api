import { Router } from "express"
import * as friends_service from "../../../services/api/users/friends"
import { authJWT } from "../../../middleware/users"
import { getUser as getUserMid } from "../../../middleware/users"
import { getUserByIdSafe, getUserByName } from "../../../services/api/users"

let router = Router()

// POST ../friends/add/:username
// Send a friend request to the user with the specified name
router.post("/add/:username", authJWT, getUserMid, async (req, res, next) => {
    try {
        const ret = await friends_service.sendRequest(
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

// PUT ../friends/answer
// Answer the request with the specified id. The answer can be either "accept" or "deny"
router.put("/answer", authJWT, async (req, res, next) => {
    const req_id = req.body.request_id
    const ans = req.body.answer

    try {
        const ret = await friends_service.respondRequest(req_id, ans)

        if (ret.type != "error") {
            res.status(201)
        } else {
            res.status(400)
        }

        return res.json(ret)
    } catch (err) {
        next(err)
    }
})

// GET ../friends/requests
// Get all the pending requests for this user
router.get("/requests", authJWT, async (req, res, next) => {
    try {
        const ret = await friends_service.getRequests(req.user_id)

        if (ret.type != "error") {
            res.status(200)

            const arr = await Promise.all(
                ret.data.map(async (item) => {
                    const user = await getUserByIdSafe(item.requester)
                    return {
                        sender: user.name,
                        req_id: item._id,
                    }
                })
            )

            ret.data = arr
        } else {
            res.status(400)
        }

        return res.json(ret)
    } catch (err) {
        next(err)
    }
})

// GET ../friends/list
// Get all the friends of this user
router.get("/list", authJWT, async (req, res, next) => {
    try {
        const ret = await friends_service.getFriendList(req.user_id)

        if (ret.type != "error") {
            res.status(200)
        } else {
            res.status(400)
        }

        return res.json(ret)
    } catch (err) {
        next(err)
    }
})

// DELETE ../friends/remove/:link_id
// Remove a friend of the user, using the link_id as a indication (same as the request id)
router.delete("/remove/:link_id", authJWT, async (req, res, next) => {
    try {
        const ret = await friends_service.removeFriend(req.params.link_id)

        if (ret.type != "error") {
            res.status(201)
        } else {
            res.status(400)
        }

        return res.json(ret)
    } catch (err) {
        next(err)
    }
})

export default router
