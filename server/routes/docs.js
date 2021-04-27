'use strict';

import { Router } from 'express';
import {index_v1} from '../controllers/docs';

let router = Router()

router.get('/v1', index_v1)

export default router;