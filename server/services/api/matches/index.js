"use strict"

// Services related to the users accounts.
// NOTE - the admin accounts are added manually


import matchModel from "../../../models/matches"

/**
 * Get a match based on match id
 * @param {String} id The id of the account
 * @returns The match data
 */
export async function getMatchById(id) {
    try {
        const match = await matchModel.findById(id)
        return match._doc
    } catch (err) {
        throw new Error(err)
    }
}

