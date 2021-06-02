"use strict"

import userModel from "../../../models/users"
import friendsModel from "../../../models/users/friends"
import { friends_collection, friends_status } from "../../../constants/users"
import mongoose from "mongoose"
import { getUserById, getUserByIdSafe } from "./index"
import { send_notification } from "../../sockets/backbone"

/**
 * Update (and create, if specified) a friend connection between two users
 * @param {mongoose.ObjectId} snd_id The requester id
 * @param {mongoose.ObjectId} rec_id The receiver id
 * @param {Number} friend_status The "friend_status" of the connection
 * @param {Boolean} create If the friend connection should be created if it doesn't exist
 */
async function updateFriends(snd_id, rec_id, friend_status, create = false) {
    if (create) {
        return await friendsModel.findOneAndUpdate(
            {
                requester: snd_id,
                recipient: rec_id,
            },
            {
                $set: {
                    status: friend_status,
                },
            },
            {
                upsert: true,
                new: true,
            }
        )
    } else {
        return await friendsModel.findOneAndUpdate(
            {
                requester: snd_id,
                recipient: rec_id,
            },
            {
                $set: {
                    status: friend_status,
                },
            }
        )
    }
}

/**
 * Sends a friend request from one user to another
 * @param {String} snd_id The id of the request sender
 * @param {String} rec_id The id of the request recipient
 */
export async function sendRequest(snd_id, rec_id) {
    if (
        !mongoose.isValidObjectId(snd_id) ||
        !mongoose.isValidObjectId(rec_id)
    ) {
        return {
            type: "error",
            message: "Invalid id's",
        }
    }

    if (snd_id == rec_id) {
        return {
            type: "error",
            message: "Can't send friend request to yourself",
        }
    }
    try {
        const req = await updateFriends(
            snd_id,
            rec_id,
            friends_status.pending,
            true
        )

        await Promise.all([
            userModel.findOneAndUpdate(
                {
                    _id: snd_id,
                },
                {
                    $addToSet: {
                        friends: req._id,
                    },
                }
            ),
            userModel.findOneAndUpdate(
                {
                    _id: rec_id,
                },
                {
                    $addToSet: {
                        friends: req._id,
                    },
                }
            ),
        ])

        return {
            type: "success",
            message: "The friend request was sent",
        }
    } catch (err) {
        throw new Error(err)
    }
}

/**
 * Respond to a friend request
 * @param {String} req_id The id of the request that will be answered
 * @param {String} answer If the request is accepted or denied
 */
export async function respondRequest(req_id, answer) {
    if (!mongoose.isValidObjectId(req_id)) {
        return {
            res_status: "error",
            message: "Invalid id",
        }
    }
    try {
        const request = await friendsModel.findById(req_id)

        if (!request) {
            return {
                res_status: "error",
                message: "The request id is invalid",
            }
        }

        const user_a = request.requester
        const user_b = request.recipient
        if (answer == "accept") {
            await updateFriends(user_a, user_b, friends_status.friends, false)
            const sender_obj = await getUserById(user_b)

            // Notify the sender
            send_notification(user_a, {
                category: "friends",
                message:
                    "User " + sender_obj.name + " accepted your friend request",
            })

            return {
                res_status: "success",
                message: "The friend request was accepted",
            }
        } else {
            // "deny" response
            const req = await friendsModel.findByIdAndRemove(req_id)

            await Promise.all([
                userModel.findOneAndUpdate(
                    {
                        _id: user_a,
                    },
                    {
                        $pull: {
                            friends: req._id,
                        },
                    }
                ),
                userModel.findOneAndUpdate(
                    {
                        _id: user_b,
                    },
                    {
                        $pull: {
                            friends: req._id,
                        },
                    }
                ),
            ])
            const sender_obj = await getUserById(user_b)

            // Notify the sender
            send_notification(user_a, {
                category: "friends",
                message:
                    "User " + sender_obj.name + " denied your friend request",
            })

            return {
                res_status: "success",
                message: "The friend request was denied",
            }
        }
    } catch (err) {
        throw new Error(err)
    }
}

/**
 * Get the list of the friend requests
 * @param {String} user_id The user_id of the user that requested his pending friend requests (the ones he received)
 */
export async function getRequests(user_id) {
    if (!mongoose.isValidObjectId(user_id)) {
        return {
            type: "error",
            message: "Invalid id",
        }
    }
    try {
        const doc = await userModel
            .findOne({
                _id: user_id,
            })
            .populate({
                path: friends_collection,
                match: { status: friends_status.pending },
            })

        if (!doc.friends.length) {
            return {
                res_status: "success",
                message: "No requests for this user",
                data: [],
            }
        }
        const friends = doc.friends

        return {
            res_status: "success",
            message: "Returned the requests for this user",
            data: friends,
        }
    } catch (err) {
        throw new Error(err)
    }
}

/**
 * Get the friend list for a user (friend IGN and link_id)
 * @param {String} user_id The user id of the user which requested his friend list
 */
export async function getFriendList(user_id) {
    if (!mongoose.isValidObjectId(user_id)) {
        return {
            res_status: "error",
            message: "Invalid id",
        }
    }
    try {
        const doc = await userModel
            .findOne({
                _id: user_id,
            })
            .populate({
                path: friends_collection,
                match: { status: friends_status.friends },
            })

        if (!doc.friends.length) {
            return {
                res_status: "success",
                message: "No friends for this user",
                data: [],
            }
        }
        const friends = doc.friends

        const arr = await Promise.all(
            friends.map(async (item) => {
                const id =
                    item.requester == user_id ? item.recipient : item.requester
                const user = await getUserByIdSafe(id)
                return {
                    name: user.name,
                    link_id: item._id,
                }
            })
        )

        return {
            res_status: "success",
            message: "Returned the friend list for this user",
            data: arr,
        }
    } catch (err) {
        throw new Error(err)
    }
}

/**
 * Remove a friend of a user. Will also remove any pending requests
 * @param {String} link_id The link id of the friendship relationship
 */
export async function removeFriend(link_id) {
    if (!mongoose.isValidObjectId(link_id)) {
        return {
            res_status: "error",
            message: "Invalid id",
        }
    }
    try {
        console.log(link_id)
        const doc = await friendsModel.findByIdAndRemove(link_id)

        if (doc == null) {
            return {
                res_status: "error",
                message: "Friend relationship does not exist",
            }
        }

        await Promise.all([
            userModel.findOneAndUpdate(
                {
                    _id: doc.requester,
                },
                {
                    $pull: {
                        friends: doc._id,
                    },
                }
            ),
            userModel.findOneAndUpdate(
                {
                    _id: doc.recipient,
                },
                {
                    $pull: {
                        friends: doc._id,
                    },
                }
            ),
        ])

        return {
            res_status: "success",
            message: "The friend was removed",
        }
    } catch (err) {
        throw new Error(err)
    }
}
