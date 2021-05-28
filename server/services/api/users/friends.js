"use strict"

import userModel from "../../../models/users"
import friendsModel from "../../../models/users/friends"
import { friends_schema, friends_status } from "../../../constants/users"

/**
 * Update (and create, if specified) a friend connection between two users
 * @param {String} snd_id The requester id
 * @param {String} rec_id The receiver id
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
    if (snd_id == rec_id) {
        return {
            type: "error",
            message: "Can't send friend request to yourself",
        }
    }
    try {
        const [snd, rec] = await Promise.all([
            updateFriends(snd_id, rec_id, friends_status.requested, true),
            updateFriends(rec_id, snd_id, friends_status.pending, true),
        ])

        await Promise.all([
            userModel.findOneAndUpdate(
                {
                    _id: snd_id,
                },
                {
                    $push: {
                        friends: snd._id,
                    },
                }
            ),
            userModel.findOneAndUpdate(
                {
                    _id: rec_id,
                },
                {
                    $push: {
                        friends: rec._id,
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

export async function respondRequest(req_id, answer) {
    try {
        const request = await friendsModel.findById(req_id)

        if (!request) {
            return {
                type: "error",
                message: "The request id is invalid",
            }
        }

        const user_a = request.requester
        const user_b = request.recipient
        if (answer == "accept") {
            await Promise.all([
                updateFriends(user_a, user_b, friends_status.friends, false),
                updateFriends(user_b, user_a, friends_status.friends, false),
            ])

            // TODO - notify the sender

            return {
                type: "success",
                message: "The friend request was accepted",
            }
        } else {
            // "deny" response
            const [snd, rec] = await Promise.all([
                friendsModel.findOneAndRemove({
                    requester: user_a,
                    recipient: user_b,
                }),
                friendsModel.findOneAndRemove({
                    requester: user_b,
                    recipient: user_a,
                }),
            ])

            await Promise.all([
                userModel.findOneAndUpdate(
                    {
                        _id: user_a,
                    },
                    {
                        $pull: {
                            friends: snd._id,
                        },
                    }
                ),
                userModel.findOneAndUpdate(
                    {
                        _id: user_b,
                    },
                    {
                        $pull: {
                            friends: rec._id,
                        },
                    }
                ),
            ])

            // TODO - send notification to sender

            return {
                type: "success",
                message: "The friend request was denied",
            }
        }
    } catch (err) {
        throw new Error(err)
    }
}

export async function getRequests(user_id) {
    try {
        const docs = await userModel
            .find({
                _id: user_id,
            })
            .populate({
                path: friends_schema,
                match: { status: friends_status.pending },
            })

        console.log(docs)
    } catch (err) {
        throw new Error(err)
    }
}

export async function getFriendList(user_id) {
    try {
        const docs = await userModel.find({
            _id: user_id,
            friends: {
                status: friends_status.friends,
            },
        })

        console.log(docs)
    } catch (err) {
        throw new Error(err)
    }
}

export async function removeFriend(user_id, friend_id) {
    try {
        const [snd, rec] = await Promise.all([
            friendsModel.findOneAndRemove({
                requester: user_id,
                recipient: friend_id,
            }),
            friendsModel.findOneAndRemove({
                requester: friend_id,
                recipient: user_id,
            }),
        ])

        await Promise.all([
            userModel.findOneAndUpdate(
                {
                    _id: user_id,
                },
                {
                    $pull: {
                        friends: snd._id,
                    },
                }
            ),
            userModel.findOneAndUpdate(
                {
                    _id: friend_id,
                },
                {
                    $pull: {
                        friends: rec._id,
                    },
                }
            ),
        ])

        return {
            type: "success",
            message: "The friend was removed",
        }
    } catch (err) {
        throw new Error(err)
    }
}
