import { io } from "socket.io-client"

const authJWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDllZGJlODBiMzlhZjAwMTVkMWM0NDAiLCJpYXQiOjE2MjIxMzk2NDAsImV4cCI6MTYyMjE0MDI0MH0.TSzAMqPeU-7GMRVss72jdAOBIpkpWG99Vm-R30L2o8c"

const backbone = io("https://cooking-crisis-api-dev.herokuapp.com/backbone", {
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
