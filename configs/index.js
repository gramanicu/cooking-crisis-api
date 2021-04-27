'use strict'

import localConfig from './local.js'
// TODO - add dev and prod

const load_config = (env) => {
    switch(env) {
        case 'local': {
            return localConfig
        }
        case 'development': {
            // TODO
            return null
        }
        case 'production': {
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
const _env = process.env.NODE_ENV || 'local'

// Import lodash "merge"
import lodash_pkg from 'lodash';
const { merge } = lodash_pkg;

let envConfig = load_config(_env)

// The default values for any config
let defaultConfig = { 
    env: _env
};

export default merge(defaultConfig, envConfig)
