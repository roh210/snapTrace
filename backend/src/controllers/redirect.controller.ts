import { NextFunction, Request, Response } from "express";
import { getCachedUrl, setCachedUrl } from "../services/cache.service";
import { getUrl } from "../services/url.service";
import { isValidShortCode } from "../utils/validShortCode";

export const getUrlRequest = async (req: Request<{ shortCode: string }>, res: Response, next: NextFunction) => {
    const { shortCode } = req.params

    if (!isValidShortCode(shortCode)) return res.status(400).json({ errors: [{ message: 'Invalid short code format' }] })

    try {
        const cachedUrl = await getCachedUrl(shortCode) //cache hit
        if (cachedUrl) return res.redirect(cachedUrl)

        const { longUrl } = await getUrl(shortCode) //cache miss
        setCachedUrl(shortCode, longUrl) // fire and forget
        return res.redirect(longUrl)

    } catch (error) {
        next(error)
    }
}