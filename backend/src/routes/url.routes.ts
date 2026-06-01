import {Router} from 'express';
import { validateUrl } from '../middleware/validate';
import { urlReqSchema } from '../schemas/url.schema';
import { createUrlRequest, getUrlStatsRequest } from '../controllers/url.controller';
import { rateLimit } from '../middleware/rateLimit';
import env from '../config/env';
import { validateShortCodeParam } from '../middleware/validateShortCodeParam';


const router  : Router = Router()

router.post('/', rateLimit({maxRequestsPerWindow: env.RATE_LIMIT_REQ, windowSecs: env.RATE_LIMIT_WINDOW_SECONDS}),validateUrl(urlReqSchema), createUrlRequest)
router.get('/:shortCode/stats', validateShortCodeParam, getUrlStatsRequest)
export default router