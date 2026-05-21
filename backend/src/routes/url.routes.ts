import {Router} from 'express';
import { validateUrl } from '../middleware/validate';
import { urlReqSchema } from '../schemas/url.schema';
import { createUrlRequest } from '../controllers/url.controller';
import { rateLimit } from '../middleware/rateLimit';

const router  : Router = Router()

router.post('/', /*rateLimit,*/validateUrl(urlReqSchema), createUrlRequest)

export default router