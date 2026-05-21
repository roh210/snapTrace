import { NextFunction, Request, Response } from 'express';
import { createUrl } from '../services/url.service';

export const createUrlRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { longUrl, expiresAt } = req.body

    try {
        const urlRes = await createUrl(longUrl, expiresAt ? new Date(expiresAt) : undefined)
        res.status(201).json(urlRes)
    } catch (error) {
        next(error)
    }

}