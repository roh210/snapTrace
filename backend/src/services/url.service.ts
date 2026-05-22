import { Prisma } from "../../generated/prisma"
import { prisma } from "../config/db"
import { AppError } from "../utils/AppError"
import { generateShortCode } from "../utils/base62"

type CreateUrlResponse = {
    urlId: string,
    shortCode: string,
    longUrl: string,
    expiresAt?: Date | null,
    createdAt: Date
}

const MAX_RETRIES = 5
// optimistic write — let DB enforce uniqueness rather than pre-checking - avoids race conditions
export const createUrl = async (longUrl: string, expiresAt?: Date): Promise<CreateUrlResponse> => {
    let attempts = 0
    while (attempts < MAX_RETRIES) {
        const shortCode = generateShortCode()
        try {
            const urlResponse = await prisma.urls.create({
                data: {
                    longUrl,
                    shortCode,
                    expiresAt
                }
            })
            return urlResponse
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    attempts++
                    continue
                }
            }
            throw error
        }
    }
    throw new AppError('Failed to generate unique short code after maximum retries', 503)
}
