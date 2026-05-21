import { NextFunction, Request, Response } from "express"
import { z } from "zod"

export const validateUrl = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
       const validReq = schema.safeParse(req.body)
       if(validReq.success) next()
       else res.status(400).json({ errors: validReq.error.issues })

    }
}