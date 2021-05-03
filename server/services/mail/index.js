"use strict"

import nodemailer from "nodemailer"
import { email_name } from "../../constants/utils"

const transporter = nodemailer.createTransport({
    pool: true,
    service: "gmail",
    secure: true,
    auth: {
        user: process.env.EMAIL_ADDR,
        pass: process.env.EMAIL_PASS,
    },
})

/**
 * Send a verification email to a user
 * @param {String} email The email of the user that will receive the activation link
 * @param {String} link The activation link received by the user
 */
export async function send_verification(email, link) {
    const mailOptions = {
        from: {
            name: email_name,
            address: process.env.EMAIL_ADDR,
        },
        to: email,
        subject: "Verify Cooking Crisis Account",
        html: link,
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (err) {
        throw new Error(err)
    }
}
