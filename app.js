'use strict'

import server from './server'
import config from './configs';

// TODO - check if the server can be transformed into an object

const sv = server()

sv.create(config)
sv.start();