"use strict"

import userModel from "../../../models/users"

export async function userExists(username) {
    const doc = await userModel.findOne({ name: username }).exec()

    console.log(doc)
    return doc
}
