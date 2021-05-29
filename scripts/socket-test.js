import { io } from "socket.io-client"

const authJWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGIxMzcxYWNlNTdhOTAyODZlOTg3MzgiLCJpYXQiOjE2MjIyODUzODEsImV4cCI6MTYyMjI4NTk4MX0.prVsA0WjWOCp9IhlxGZ9wkQcj12OiPGTZnuFYRGbIcI"
const backbone = io("http://localhost:3000/backbone", {
    path: "/sockets/",
    auth: {
        token: authJWT,
    },
})

backbone.on("connect", () => {
    console.log("Connected!")
    backbone.emit("ping", Date.now())
})

backbone.on("notification", (not) => {
    console.log("Received a notification related to " + not.category)
    console.log("The notification is: " + not.message)
})

backbone.on("pong", (time) => {
    console.log("Delay is " + (Date.now() - time) + "ms")
})

backbone.on("connect_error", (err) => {
    console.log(err.message) // prints the message associated with the error
})

backbone.on("error", (err) => {
    console.error(err)
})
