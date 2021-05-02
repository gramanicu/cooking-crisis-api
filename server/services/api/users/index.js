"use strict"

// Services related to the users accounts.
// NOTE - the admin accounts are added manually

import {
    passwordRegexp,
    emailRegexp,
    salting_rounds,
    starting_elo,
    usernameRegexp,
} from "../../../constants/utils"
import userModel from "../../../models/users"
import bcrypt from "bcrypt"
import { user_status } from "../../../constants/users"

export async function getUserByName(username) {
    try {
        const query = await userModel.find({ name: username }).limit(1)

        if (query.length) {
            return query[0]
        } else {
            return null
        }
    } catch (err) {
        throw new Error(err)
    }
}

/**
 * Try to create a new account (if the data is valid/user does not exist already)
 * Returns a object with two fields (type: error | success and message: ...)
 * @param {String} username The IGN for the user
 * @param {String} password The password of the user (will be encrypted)
 * @param {String} email The email associated for the account
 */
export async function createAccount(username, password, email) {
    // The username of a user must be unique, no matter the account. However, someone can
    // have multiple accounts on the same email, but with different roles (player & admin)
    const passwordTester = new RegExp(passwordRegexp)
    const emailTester = new RegExp(emailRegexp)
    const usernameTester = new RegExp(usernameRegexp)

    // Check username
    const usernameValid = usernameTester.test(username)
    if (!usernameValid) {
        return {
            type: "error",
            message: "Username is not a valid name",
        }
    }
    try {
        const usernameExisting = await userModel.exists({ name: username })
        if (usernameExisting) {
            return {
                type: "error",
                message: "Username in use",
            }
        }
    } catch (err) {
        throw new Error(err)
    }

    // Check password
    const passwordValid = passwordTester.test(password)
    if (!passwordValid) {
        return {
            type: "error",
            message:
                "The password must contain at least 8 (maximum 32) characters, including a number, uppercase, lowercase and one special character",
        }
    }

    // Check that the email is a valid email
    const emailValid = emailTester.test(email)
    if (!emailValid) {
        return {
            type: "error",
            message: "The email is invalid",
        }
    }

    // Check that there is no other user with the same email that is a player
    try {
        const emailTypeExisting = await userModel.exists({
            email: email,
            isAdmin: false,
        })

        if (emailTypeExisting) {
            return {
                type: "error",
                message: "Another account is linked to the email address",
            }
        }
    } catch (err) {
        throw new Error(err)
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(salting_rounds)
    const encryptedPwd = await bcrypt.hash(password, salt)

    // Set the other account data: isAdmin=false, ELO = starting_elo, status = offline
    const user = new userModel({
        name: username,
        email: email,
        password: encryptedPwd,
        status: user_status.offline,
        elo: starting_elo,
        isAdmin: false,
    })

    // Create the account
    try {
        await user.save()
    } catch (err) {
        throw new Error(err)
    }

    return {
        type: "success",
        message:
            "Account created. An activation link was sent to the provided email",
    }
}

export async function verifySignIn(username, password) {
    const passwordTester = new RegExp(passwordRegexp)
    const usernameTester = new RegExp(usernameRegexp)

    // Check if the provided account could be an IGN
    const usernameValid = usernameTester.test(username)
    if (!usernameValid) {
        return false
    }

    // Check if the provided password is valid
    const passwordValid = passwordTester.test(password)
    if (!passwordValid) {
        return false
    }

    try {
        const userData = await userModel
            .find({
                name: username,
            })
            .limit(1)

        if (userData.length) {
            const correctPassword = await bcrypt.compare(
                password,
                userData[0].password
            )

            return correctPassword
        } else {
            return false
        }
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}
