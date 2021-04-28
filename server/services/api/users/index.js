"use strict"

import userModel from "../../../models/users"

const getUserWithId = (id) => {
    return null
}

async function getUserWithName(username) {
    const doc = await userModel.findOne({ name: username }).exec()
    return doc
}
const getUserWithEmail = (_email) => {
    return null
}

export { getUserWithId, getUserWithName, getUserWithEmail }
