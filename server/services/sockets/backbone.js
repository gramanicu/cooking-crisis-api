"use strict"

import { io } from "../../sockets"

/**
 * Sends a notification to a client. The client must be connected to the "backbone" socket
 * api to be able to receive the message.
 * @param {String} user_id The id of the user to send the notification to
 * @param {Object} notification The notification object that must be sent
 */
export function send_notification(user_id, notification) {
    io.sockets.in(user_id).emit("notification", notification)
}
