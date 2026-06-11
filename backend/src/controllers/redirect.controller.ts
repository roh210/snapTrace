import { NextFunction, Request, Response } from "express";
import { getCachedUrl, setCachedUrl } from "../services/cache.service";
import { getUrl } from "../services/url.service";
import { logClick } from "../services/analytics.service";

export const getUrlRequest = async (req: Request<{ shortCode: string }>, res: Response, next: NextFunction) => {
    const { shortCode } = req.params
    try {
        const cachedUrl = await getCachedUrl(shortCode) //cache hit
        if (cachedUrl) {
            res.on('finish', () => {
                logClick({ urlId: cachedUrl.urlId, ipAddress: req.ip ?? 'unknown', longUrl: cachedUrl.longUrl, expiresAt: cachedUrl.expiresAt || null , shortCode })
            })
            return res.redirect(cachedUrl.longUrl)
        }
        const { longUrl, urlId, expiresAt } = await getUrl(shortCode) //cache miss
        res.on('finish', () => {
            logClick({ urlId, ipAddress: req.ip ?? 'unknown', longUrl, expiresAt: expiresAt || null, shortCode })
        })
        setCachedUrl(shortCode, longUrl, urlId, expiresAt|| null, 0) // fire and forget
        return res.redirect(longUrl)

    } catch (error) {
        next(error)
    }
}