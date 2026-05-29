import { NextFunction, Request, Response } from "express";
import redis from "../config/redis";


type RateLimitOptions = {
    maxRequestsPerWindow: number;
    windowSecs: number;
}

export const rateLimit = ({ maxRequestsPerWindow, windowSecs }: RateLimitOptions) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const ip = req.ip ?? 'unknown';
        const key = `rate:${ip}`;
        try {
            await redis.set(key, 0, 'EX', windowSecs, 'NX')
            const count = await redis.incr(key)
            if (count > maxRequestsPerWindow) {
                res.set('Retry-After', windowSecs.toString())
                return res.status(429).json({ errors: [{ message: 'Too many requests' }] })
            } else {
                next()
            }
        } catch (error) {
            console.error('Rate limit error Redis error:', error);
            next()
        }
    }

}