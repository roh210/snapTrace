import {Router} from 'express'
import { getUrlRequest } from '../controllers/redirect.controller';

const router  : Router = Router()

router.get('/:shortCode', getUrlRequest)

export default router