"use strict"

// Services related to the users accounts.
// NOTE - the admin accounts are added manually

import {
    passwordRegexp,
    emailRegexp,
    salting_rounds,
    usernameRegexp,
    jwt_expiry_time,
} from "../../../constants/utils"
import userModel from "../../../models/users"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { send_verification } from "../../mail"
import config from "../../../../configs"
import jwt from "jsonwebtoken"

/**
 * Get a user based on his IGN
 * @param {String} username The username of the account
 * @returns The account data
 */
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
 * @returns The status of the "request" (json object, with a type="error"|"success")
 */
export async function createAccount(username, password, email) {
    // The username of a user must be unique, no matter the account. However, someone can
    // have multiple accounts on the same email, but with different roles (player & admin)
    const passwordTester = new RegExp(passwordRegexp)
    const emailTester = new RegExp(emailRegexp)
    const usernameTester = new RegExp(usernameRegexp)
    const lc_name = username.toLowerCase()

    // Check username
    const usernameValid = usernameTester.test(username)
    if (!usernameValid) {
        return {
            type: "error",
            message: "Username is not a valid name",
        }
    }
    try {
        const usernameExisting = await userModel.exists({
            lowercase_name: lc_name,
        })
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

    // Create verification link
    const activation_token = crypto.randomBytes(32).toString("hex")
    const auth_link =
        config.hostname + "/api/v1/users/activation/" + activation_token

    // Send the link
    try {
        await send_verification(email, auth_link)
    } catch (err) {
        throw new Error(err)
    }

    // Set the other account data: isAdmin=false, ELO = starting_elo, status = offline
    const user = new userModel({
        name: username,
        lowercase_name: lc_name,
        email: email,
        password: encryptedPwd,
        activation_token: activation_token,
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

/**
 * Verify the email address and activate the account
 * @param {String} token The token used to activate the account
 * @returns The status of the "request" (json object, with a type="error"|"success")
 */
export async function activateAccount(token) {
    try {
        const doc = await userModel
            .find({
                activation_token: token,
                activation_expiry: {
                    $gte: new Date(),
                },
            })
            .limit(1)

        if (doc.length) {
            doc[0].activated = true
            doc[0].activation_token = undefined
            doc[0].activation_expiry = undefined

            await doc[0].save()

            return {
                type: "success",
                message: "Account is now activated",
            }
        } else {
            // Delete all the expired tokens
            await deleteExpiredTokens()
            return {
                type: "error",
                message: "Token not found or expired",
            }
        }
    } catch (err) {
        throw new Error(err)
    }
}

/**
 * Login a user into his account
 * @param {String} username The username of the user (IGN)
 * @param {String} password The password of the user
 * @returns The status of the "request" (json object, with a type="error"|"success"). If it was successful,
 * will also return a JWT
 */
export async function verifySignIn(username, password) {
    const passwordTester = new RegExp(passwordRegexp)
    const usernameTester = new RegExp(usernameRegexp)
    const lc_name = username.toLowerCase()

    // Check if the provided account could be an IGN and the provided password is valid
    const usernameValid = usernameTester.test(username)
    const passwordValid = passwordTester.test(password)

    if (!passwordValid || !usernameValid) {
        return {
            type: "error",
            message: "Invalid login",
        }
    }

    try {
        const userData = await userModel
            .find({ lowercase_name: lc_name })
            .limit(1)

        if (userData.length) {
            const correctPassword = await bcrypt.compare(
                password,
                userData[0].password
            )

            // If the password is correct, generate the JWT and return the data
            if (correctPassword) {
                const jwt_token = await generateAccessToken(userData[0].id)
                return {
                    type: "success",
                    message: "Login was successful",
                    jwt_token: jwt_token,
                }
            }
        }

        return {
            type: "error",
            message: "Invalid login",
        }
    } catch (err) {
        throw new Error(err)
    }
}

/**
 * Delete all the users with expired tokens.
 * This should not delete users that have no tokens/expiry date
 */
export async function deleteExpiredTokens() {
    try {
        await userModel.deleteMany({ activation_expiry: { $lte: new Date() } })
    } catch (err) {
        throw new Error(err)
    }
}

/**
 * Generate a JWT based on the _id of an user
 * @param {String} _id The id of the user
 * @returns
 */
export async function generateAccessToken(_id) {
    return jwt.sign({ _id }, config.jwt_secret, { expiresIn: jwt_expiry_time })
}
