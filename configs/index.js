"use strict"

import localConfig from "./local"
import developmentConfig from "./development"

// Import lodash "merge"
import lodash_pkg from "lodash"
const { merge } = lodash_pkg

// TODO - add prod

const load_config = (env) => {
    switch (env) {
        case "local": {
            return localConfig
        }
        case "development": {
            return developmentConfig
        }
        case "production": {
            // TODO
            return null
        }
    }
}

/*
NODE_ENV will be "undefined" by default. In that case, env will be set to 'local'. 
The accepted values for it are "development" or "production"

env = {local, development, production}
*/
const _env = process.env.NODE_ENV || "local"

let envConfig = load_config(_env)

// The default values for any config
let defaultConfig = {
    env: _env,
    redis_url: process.env.REDIS_URL,
    mongoose_uri: process.env.MONGOOSE_URI,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    verify_activated: true,
    hostname: "http://localhost:3000",
    port: process.env.PORT,
    activation_address:
        "https://cooking-crisis-web-dev.herokuapp.com/activate/",
}

export default merge(defaultConfig, envConfig)
