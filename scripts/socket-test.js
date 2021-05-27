import { io } from "socket.io-client"

const authJWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDllZGJlODBiMzlhZjAwMTVkMWM0NDAiLCJpYXQiOjE2MjIxMzgwMzEsImV4cCI6MTYyMjEzODYzMX0.BpusAqahTstAJF_QB-g5bqjoqNliXsqqpg1YRayuudM"

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

backbone.on("pong", (time) => {
    console.log("Delay is " + (Date.now() - time) + "ms")
})

backbone.on("connect_error", (err) => {
    console.log(err.message) // prints the message associated with the error
})

backbone.on("error", (err) => {
    console.error(err)
})
