"use strict"

// A regex string used to validate email addresses
export const emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

// A regex string used to validate a password
// The password must contain at least 8 (maximum 32) characters, including
// a number, uppercase, lowercase and one special character
export const passwordRegexp =
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#!$%&'()*+,-./:;<=>?@^_`{|}~])(?=.{8,32})"

// A regex string used to validate the IGN (alphanumeric + some special chars). Between
// 1 and 16 chars
export const usernameRegexp = /^[ A-Za-z0-9_.#&-]{1,16}$/

// Salting rounds used by bcrypt
export const salting_rounds = 16

// TODO - research the actual starting value
export const starting_elo = 500

// The email activation link expiry time (milliseconds * seconds * minutes * hours * days)
// Currently set to 3 days
export const activation_expiry_time = 1000 * 60 * 60 * 24 * 3

export const email_name = "CookingCrisis"

export const jwt_access_expiry_time = "10m"
export const jwt_refresh_expiry_time = "7d"
