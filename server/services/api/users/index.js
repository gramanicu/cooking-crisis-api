"use strict"

// Services related to the users accounts.
// NOTE - the admin accounts are added manually

import {
    password_regexp,
    email_regexp,
    salting_rounds,
    username_regexp,
    jwt_access_expiry_time,
    jwt_refresh_expiry_time,
} from "../../../constants/utils"
import userModel from "../../../models/users"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { send_verification } from "../../mail"
import config from "../../../../configs"
import jwt from "jsonwebtoken"
import { user_status } from "../../../constants/users"

/**
 * Get a user based on his id
 * @param {String} username The id of the account
 * @returns The account data
 */
export async function getUserById(id) {
    try {
        const user = await userModel.findById(id)
        return user._doc
    } catch (err) {
        throw new Error(err)
    }
}

/**
 * Get a user based on his id. This function is safe, as it filters
 * data that doesn't need to be sent to the clients
 * @param {String} username The id of the account
 * @returns The account data
 */
export async function getUserByIdSafe(id) {
    try {
        const user = await userModel.findById(
            id,
            "-_id name email status elo created_at"
        )

        return user._doc
    } catch (err) {
        throw new Error(err)
    }
}

/**
 * Get a user based on his IGN
 * @param {String} username The username of the account
 * @returns The account data
 */
export async function getUserByName(username) {
    try {
        const query = await userModel.find({ name: username }).limit(1)

        if (query.length) {
            return query[0]._doc
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
    const password_tester = new RegExp(password_regexp)
    const email_tester = new RegExp(email_regexp)
    const username_tester = new RegExp(username_regexp)
    const lc_name = username.toLowerCase()

    // Check username
    const usernameValid = username_tester.test(username)
    if (!usernameValid) {
        return {
            type: "error",
            message: "Username is not a valid name",
        }
    }
    try {
        const username_existing = await userModel.exists({
            lowercase_name: lc_name,
        })
        if (username_existing) {
            return {
                type: "error",
                message: "Username in use",
            }
        }
    } catch (err) {
        throw new Error(err)
    }

    // Check password
    const password_valid = password_tester.test(password)
    if (!password_valid) {
        return {
            type: "error",
            message:
                "The password must contain at least 8 (maximum 32) characters, including a number, uppercase, lowercase and one special character",
        }
    }

    // Check that the email is a valid email
    const email_valid = email_tester.test(email)
    if (!email_valid) {
        return {
            type: "error",
            message: "The email is invalid",
        }
    }

    // Check that there is no other user with the same email that is a player
    try {
        const email_type_existing = await userModel.exists({
            email: email,
            is_admin: false,
        })

        if (email_type_existing) {
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
    const encrypted_pwd = await bcrypt.hash(password, salt)

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

    // Set the other account data: is_admin=false, ELO = starting_elo, status = offline
    const user = new userModel({
        name: username,
        lowercase_name: lc_name,
        email: email,
        password: encrypted_pwd,
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
 * Change the password of a user (based on his id)
 * @param {String} id The id of the user
 * @param {String} old_password The old password of the user
 * @param {String} new_password The new password of the user
 */
export async function changePassword(id, old_password, new_password) {
    const password_tester = new RegExp(password_regexp)

    // Check if the provided passwords are valid
    const old_password_valid = password_tester.test(old_password)
    const new_password_valid = password_tester.test(new_password)

    if (!old_password_valid || !new_password_valid) {
        return {
            type: "error",
            message: "Invalid passwords",
        }
    }

    try {
        const userData = await userModel.findById(id)

        if (userData) {
            const correctPassword = await bcrypt.compare(
                old_password,
                userData.password
            )

            // If the old password is correct, replace it with the new password
            if (correctPassword) {
                const salt = await bcrypt.genSalt(salting_rounds)
                const encryptedPwd = await bcrypt.hash(new_password, salt)
                userData.password = encryptedPwd
                await userData.save()

                return {
                    type: "success",
                    message: "The password was updated",
                }
            }
        }

        return {
            type: "error",
            message: "Invalid data",
        }
    } catch (err) {
        throw new Error(err)
    }
}

/**
 * Login a user into his account. The account must be activated beforehand
 * @param {String} username The username of the user (IGN)
 * @param {String} password The password of the user
 * @returns The status of the "request" (json object, with a type="error"|"success"). If it was successful,
 * will also return a JWT
 */
export async function verifySignIn(username, password) {
    const passwordTester = new RegExp(password_regexp)
    const usernameTester = new RegExp(username_regexp)
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
            if (!userData[0].activated) {
                return {
                    type: "error",
                    message: "Account was not activated",
                }
            }

            const correctPassword = await bcrypt.compare(
                password,
                userData[0].password
            )

            // If the password is correct, generate the JWT and return the data
            if (correctPassword) {
                const access_token = await generateAccessToken(userData[0].id)
                const refresh_token = await generateRefreshToken(userData[0].id)

                // Save the refresh token for the current session
                // and update the user status
                userData[0].refresh_token = refresh_token
                userData[0].status = user_status.online
                await userData[0].save()

                return {
                    type: "success",
                    message: "Login was successful",
                    access_token: access_token,
                    refresh_token: refresh_token,
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
 * Signs the user out from his account.
 * @param {String} refresh_token The JWT refresh token.
 */
export async function signOutAccount(refresh_token) {
    try {
        // Get the user id from the refresh_token
        let decoded_id
        try {
            decoded_id = jwt.verify(refresh_token, config.jwt_refresh_secret)
        } catch (err) {
            return {
                type: "error",
                message: "The provided data is not a valid JWT",
            }
        }

        // Check if the id is valid (the token actually had a valid id)
        const userData = await userModel.findById(decoded_id._id)

        if (userData) {
            userData.refresh_token = undefined
            userData.status = user_status.offline
            await userData.save()

            return {
                type: "success",
                message: "User is signed out.",
            }
        }

        return {
            type: "error",
            message: "The refresh token does not exist.",
        }
    } catch (err) {
        throw new Error(err)
    }
}

/**
 * Creates a new JWT access token for the user that has the specified refresh token.
 * @param {String} refresh_token The JWT refresh token.
 */
export async function refreshAccessToken(refresh_token) {
    try {
        // Get the user id from the refresh_token
        let decoded_id
        try {
            decoded_id = jwt.verify(refresh_token, config.jwt_refresh_secret)
        } catch (err) {
            return {
                type: "error",
                message: "The provided data is not a valid JWT",
            }
        }

        // Check if the id is valid (the token actually had a valid id)
        const userData = await userModel.findById(decoded_id._id)

        if (userData) {
            // Check if the refresh token is the one assigned to this user
            if (refresh_token == userData.refresh_token) {
                const new_access_token = await generateAccessToken(userData._id)

                return {
                    type: "success",
                    message: "Access token was refreshed",
                    access_token: new_access_token,
                }
            }
        }

        return {
            type: "error",
            message: "The refresh token does not exist.",
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
 * Generate a JWT access token based on the _id of an user.
 * @param {String} _id The id of the user
 * @returns The access token
 */
export async function generateAccessToken(_id) {
    return jwt.sign({ _id }, config.jwt_access_secret, {
        expiresIn: jwt_access_expiry_time,
    })
}

/**
 * Generate a JWT refresh token based on the _id of an user
 * @param {String} _id The id of the user
 * @returns The refresh token
 */
export async function generateRefreshToken(_id) {
    return jwt.sign({ _id }, config.jwt_refresh_secret, {
        expiresIn: jwt_refresh_expiry_time,
    })
}
