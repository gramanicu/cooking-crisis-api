"use strict"

import { user_status } from "../../../constants/users"
import userModel from "../../../models/users"

/**
 * Check if the specified user exists
 * @param {String} username
 * @returns If the user exists
 */
export async function userExists(username) {
    const doc = await userModel.findOne({ name: username }).exec()

    if (doc) {
        return true
    } else {
        return false
    }
}

/**
 * Check the status of the specified user
 * @param {String} username
 * @returns The `user_status` of the user
 */
export async function userStatus(username) {
    const doc = await userModel.findOne({ name: username }).exec()

    if (doc) {
        console.log(doc)
    } else {
        return user_status.undefined
    }
}
