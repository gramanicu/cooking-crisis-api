"use strict"

let devConfig = {
    hostname: "cooking-crisis-api-dev.herokuapp.com",
    port: process.env.PORT || 3000,
    mongoose_uri: process.env.MONGOOSE_URI,
}

export default devConfig
