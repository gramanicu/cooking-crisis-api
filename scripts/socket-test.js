import { io } from "socket.io-client"

const authJWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDllZGJlODBiMzlhZjAwMTVkMWM0NDAiLCJpYXQiOjE2MjIxMzM3MzUsImV4cCI6MTYyMjEzNDMzNX0.oVQfpU6qMs1jjRZOy7wh5jupYbXZlHLCyjyDxlG1vns"

const backbone = io("http://localhost:3000/backbone", {
    path: "/sockets/",
    auth: {
        token: authJWT,
    },
})

backbone.on("connect", function (socket) {
    console.log("Connected!")
    socket.emit("ping")
})

backbone.on("connect_error", (err) => {
    console.log(err.message) // prints the message associated with the error
})

backbone.on("error", (err) => {
    console.error(err)
})
