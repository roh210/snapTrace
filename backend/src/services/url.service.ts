import { Prisma } from "@prisma/client"
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

type GetUrlResponse = Pick<CreateUrlResponse, 'urlId' | 'longUrl' | 'expiresAt'>

type GetUrlStatsResponse = CreateUrlResponse & { clickCount: number }

const MAX_RETRIES = 5
// optimistic write — let DB enforce uniqueness rather than pre-checking - avoids race conditions
export const createUrl = async (longUrl: string, expiresAt?: Date): Promise<CreateUrlResponse> => {

    if (expiresAt && expiresAt <= new Date()) throw new AppError('expiresAt must be in the future', 400)

    for (let attempts = 0; attempts < MAX_RETRIES; attempts++) {
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
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') continue // unique constraint violation - retry with a new short code
            throw error
        }
    }
    throw new AppError('Failed to generate unique short code after maximum retries', 503)
}

export const getUrl = async (shortCode: string): Promise<GetUrlResponse> => {
    const urlResponse = await prisma.urls.findUnique({ where: { shortCode } })

    if (!urlResponse) throw new AppError('URL not found', 404)
    if (urlResponse.expiresAt && urlResponse.expiresAt <= new Date()) throw new AppError('URL has expired', 410)

    return { urlId: urlResponse.urlId, longUrl: urlResponse.longUrl, expiresAt: urlResponse.expiresAt }
}

export const getUrlStats = async (shortCode: string): Promise<GetUrlStatsResponse> => {
    const urlResponse = await prisma.urls.findUnique({ where: { shortCode }, include: { _count: { select: { clicks: true } } } })

    if (!urlResponse) throw new AppError('URL not found', 404)
    if (urlResponse.expiresAt && urlResponse.expiresAt <= new Date()) throw new AppError('URL has expired', 410)

    return {
        urlId: urlResponse.urlId,
        shortCode: urlResponse.shortCode,
        longUrl: urlResponse.longUrl,
        expiresAt: urlResponse.expiresAt,
        createdAt: urlResponse.createdAt,
        clickCount: urlResponse._count.clicks  // note: clickCount reflects flushed data only — eventual consistency within FLUSH_INTERVAL_MS
    }
}