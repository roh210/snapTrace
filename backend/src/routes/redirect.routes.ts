import {Router} from 'express'
import { getUrlRequest } from '../controllers/redirect.controller';
import { validateShortCodeParam } from '../middleware/validateShortCodeParam';

const router  : Router = Router()

router.get('/:shortCode', validateShortCodeParam, getUrlRequest)

export default router