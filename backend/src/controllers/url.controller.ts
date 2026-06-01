import { NextFunction, Request, Response } from 'express';
import { createUrl, getUrlStats } from '../services/url.service';

export const createUrlRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { longUrl, expiresAt } = req.body

    try {
        const urlRes = await createUrl(longUrl, expiresAt ? new Date(expiresAt) : undefined)
        res.status(201).json(urlRes)
    } catch (error) {
        next(error)
    }
}

export const getUrlStatsRequest = async (req: Request<{ shortCode: string }>, res: Response, next: NextFunction) => {
    const { shortCode } = req.params
    try {
        const stats = await getUrlStats(shortCode)
        res.json(stats)
    } catch (error) {
        next(error)
    }

}