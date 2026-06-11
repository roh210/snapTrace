import { prisma } from "../config/db";
import env from "../config/env";
import { eventEmitter } from "../events/eventBus";
import { getCachedUrl, setCachedUrl } from "./cache.service";

type ClickEvent = {
  urlId: string;
  ipAddress: string;
  clickedAt: Date;
};

type LogClickParams = Omit<ClickEvent, 'clickedAt'> & { longUrl: string; expiresAt: Date | null, shortCode: string }

const clickBuffer: ClickEvent[] = [];
const MAX_BUFFER_SIZE = 10_000
const clickBufferMap = new Map<string, number>() // shortCode -> clickCount in buffer, used for quick lookup to update click count in sse clients

export const logClick = ({ urlId, ipAddress, longUrl, expiresAt, shortCode }: LogClickParams): void => {
  if (clickBuffer.length >= MAX_BUFFER_SIZE) {
    console.warn('[analytics] Buffer full - dropping click event')
    return
  }
  clickBuffer.push({ urlId, ipAddress, clickedAt: new Date() })
  clickBufferMap.set(shortCode, (clickBufferMap.get(shortCode) || 0) + 1)
  const cacheCount = getCachedUrl(shortCode).then(cached => cached?.clickCount || 0)
  cacheCount.then(cache => {
    const totalCount = cache + (clickBufferMap.get(shortCode) || 0)
    eventEmitter.emit('click', shortCode, { shortCode, clickCount: totalCount, longUrl, expiresAt })
  }).catch(err => console.error('[analytics] logClick failed to get cache:', err))
}


const flush = async (): Promise<void> => {
  if (clickBuffer.length === 0) return
  const toFlush = [...clickBuffer]
  const bufferMapCopy = new Map(clickBufferMap)
  clickBuffer.length = 0
  clickBufferMap.clear()
  try {
    await prisma.clicks.createMany({ data: toFlush })
    await Promise.all(Array.from(bufferMapCopy.entries()).map(async ([shortCode, count]) => {
      const cached = await getCachedUrl(shortCode)
      if (cached) {
        const dbCount = await prisma.clicks.count({ where: { urlId: cached?.urlId } })
        setCachedUrl(shortCode, cached.longUrl, cached.urlId, cached.expiresAt, dbCount)
        eventEmitter.emit('click', shortCode, { shortCode, clickCount: dbCount, longUrl: cached.longUrl, expiresAt: cached.expiresAt })
      }
    }))
  } catch (error) {
    console.error('[analytics] Flush failed - batch dropped', error)
    //note : toFlush clicks are lost - acceptable for analytics
  }
}

let intervalHandle: ReturnType<typeof setInterval> | null = null

export const start = (): void => {
  intervalHandle = setInterval(flush, env.FLUSH_INTERVAL_MS)
}

export const shutdown = async (): Promise<void> => {
  if (intervalHandle) clearInterval(intervalHandle)
  await flush()
}