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
    mongoose_uri: process.env.MONGOOSE_URI,
    jwt_secret: process.env.JWT_TOKEN,
}

export default merge(defaultConfig, envConfig)
