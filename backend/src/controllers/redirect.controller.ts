import { NextFunction, Request, Response } from "express";
import { getCachedUrl, setCachedUrl } from "../services/cache.service";
import { getUrl } from "../services/url.service";

export const getUrlRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { shortCode } = req.params as { shortCode: string }
    try {
        const cachedUrl = await getCachedUrl(shortCode) //cache hit
        if (cachedUrl) {
            return res.redirect(cachedUrl)
        }
        const { longUrl } = await getUrl(shortCode) //cache miss
        await setCachedUrl(shortCode, longUrl)
        return res.redirect(longUrl)

    } catch (error) {
        next(error)
    }
}