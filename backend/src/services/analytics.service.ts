import { prisma } from "../config/db";
import env from "../config/env";

type ClickEvent = {
  urlId: string;
  ipAddress: string;
  clickedAt: Date;
};

const clickBuffer: ClickEvent[] = [];
const MAX_BUFFER_SIZE = 10_000

export const logClick = ({ urlId, ipAddress }: Omit<ClickEvent, 'clickedAt'>): void => {
  if (clickBuffer.length >= MAX_BUFFER_SIZE) {
    console.warn('[analytics] Buffer full - dropping click event')
    return
  }
  clickBuffer.push({ urlId, ipAddress, clickedAt: new Date() })
}


const flush = async (): Promise<void> => {
  if (clickBuffer.length === 0) return
  const toFlush = [...clickBuffer]
  clickBuffer.length = 0
  try {
    await prisma.clicks.createMany({ data: toFlush })
  } catch (error) {
    console.error('[analytics] Flush failed - batch dropped', error)
    //note : toFlush clicks are lost - acceptable for analytics
  }
}

let intervalHandle: ReturnType<typeof setInterval> | null = null 

export const start = (): void =>{
  intervalHandle = setInterval(flush,env.FLUSH_INTERVAL_MS)
}

export const shutdown = async () : Promise<void> =>{
  if(intervalHandle) clearInterval(intervalHandle)
  await flush()
}