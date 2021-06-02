"use strict"

let devConfig = {
    hostname: "https://cooking-crisis-api-dev.herokuapp.com",
    port: process.env.PORT || 3000,
    activation_address:
        "https://cooking-crisis-web-dev.herokuapp.com/activate/",
    verify_activated: true,
}

export default devConfig
