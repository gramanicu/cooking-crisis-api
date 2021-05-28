"use strict"

import userModel from "../../../models/users"
import friendsModel from "../../../models/users/friends"
import { friends_status } from "../../../constants/users"

/**
 * Update (and create, if specified) a friend connection between two users
 * @param {String} snd_id The requester id
 * @param {String} rec_id The receiver id
 * @param {Number} friend_status The "friend_status" of the connection
 * @param {Boolean} create If the friend connection should be created if it doesn't exist
 */
async function update_friends(snd_id, rec_id, friend_status, create = false) {
    if (create) {
        friendsModel.findOneAndUpdate(
            {
                requester: snd_id,
                recipient: rec_id,
            },
            { $set: { status: friend_status } },
            { upsert: true, new: true }
        )
    } else {
        friendsModel.findOneAndUpdate(
            {
                requester: snd_id,
                recipient: rec_id,
            },
            { $set: { status: friend_status } }
        )
    }
}

/**
 * Sends a friend request from one user to another
 * @param {String} sender_id The id of the request sender
 * @param {String} recipient_id The id of the request recipient
 */
export async function send_request(sender_id, recipient_id) {
    if (sender_id != recipient_id) {
        try {
            const [snd, rec] = await Promise.all([
                update_friends(
                    sender_id,
                    recipient_id,
                    friends_status.requested,
                    true
                ),
                update_friends(
                    recipient_id,
                    sender_id,
                    friends_status.pending,
                    true
                ),
            ])

            const [userA, userB] = await Promise.all([
                userModel.findOneAndUpdate(
                    { _id: sender_id },
                    { $push: { friends: snd._id } }
                ),
                userModel.findOneAndUpdate(
                    { _id: recipient_id },
                    { $push: { friends: rec._id } }
                ),
            ])

            return {
                type: "success",
                message: "The friend request was sent",
            }
        } catch (err) {
            throw new Error(err)
        }
    } else {
        return {
            type: "error",
            message: "Can't send friend request to yourself",
        }
    }
}
