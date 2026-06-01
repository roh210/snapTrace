import { NextFunction, Request, Response } from "express"
import { isValidShortCode } from "../utils/validShortCode"

export const validateShortCodeParam = (req: Request, res: Response, next: NextFunction) => {
    const { shortCode } = req.params as { shortCode: string }
    if (!isValidShortCode(shortCode)) {
        return res.status(400).json({ errors: [{ message: 'Invalid short code format' }] })
    }
    next()
}