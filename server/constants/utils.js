"use strict"

// A regex string used to validate email addresses
export const emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

// A regex string used to validate a password
// The password must contain at least 8 (maximum 32) characters, including
// a number, uppercase, lowercase and one special character
export const passwordRegexp =
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#!$%&'()*+,-./:;<=>?@^_`{|}~])(?=.{8,32})"

// Salting rounds used by bcrypt
export const salting_rounds = 16

// TODO - research the actual starting value
export const starting_elo = 500
