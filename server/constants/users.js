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
    pending: 1,
    friends: 2,
})

export const user_schema = "user"
export const user_collection = "users"
export const friends_schema = "friend"
export const friends_collection = "friends"
