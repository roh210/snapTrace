import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ "errors": [{ "message": err.message }] })
    } else {
        res.status(500).json({ "errors": [{ "message": "Internal Server Error" }] })
    }
}