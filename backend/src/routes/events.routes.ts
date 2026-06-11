import { Router, Request, Response } from 'express';
import { sseRegistry } from '../sse/sse.registry';
import { validateShortCodeParam } from '../middleware/validateShortCodeParam';
import { getCachedUrl, setCachedUrl } from '../services/cache.service';
import { getUrlStats } from '../services/url.service';
import { formatSseData, SSE_HEADERS } from '../sse/sse.utils';


const router: Router = Router()

router.get('/:shortCode/events', validateShortCodeParam, async (req: Request<{ shortCode: string }>, res: Response) => {
    const { shortCode } = req.params
    
    res.writeHead(200, SSE_HEADERS);

    res.flushHeaders()

    try {
        const cachedUrl = await getCachedUrl(shortCode) //cache hit
        if (cachedUrl) {
            res.write(formatSseData({
                shortCode,
                clickCount: cachedUrl.clickCount || 0,
                longUrl: cachedUrl.longUrl,
                expiresAt: cachedUrl.expiresAt || null
            }))
        } else {
            const { longUrl, urlId, expiresAt, clickCount } = await getUrlStats(shortCode) //cache miss
            res.write(formatSseData({
                shortCode,
                clickCount,
                longUrl,
                expiresAt: expiresAt || null
            }))
            setCachedUrl(shortCode, longUrl, urlId, expiresAt || null, clickCount) // fire and forget
        }
    } catch (error) {
        console.error('[events] failed to fetch initial state:', error)
        res.end()
        return
    }
    sseRegistry.add(shortCode, res)
    req.on('close', () => {
        sseRegistry.remove(shortCode, res)
    })
})

export default router 