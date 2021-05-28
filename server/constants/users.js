// Different constants related to the user
"use strict"

// Const that holds the status of a user
export const user_status = Object.freeze({
    undefined: 0,
    offline: 1,
    online: 2,
    afk: 3,
    playing: 4,
})

export const friends_status = Object.freeze({
    undefined: 0,
    requested: 1, // This user has requested friendship
    pending: 2, // The other user has requested friendship
    friends: 3,
})

export const user_schema = "user"
export const user_collection = "users"
export const friends_schema = "friend"
export const friends_collection = "friends"
