import env from "../config/env";
import redis from "../config/redis";


export const getCachedUrl = async (shortCode: string):Promise<{urlId:string;longUrl:string;clickCount:number, expiresAt:Date | null} |null> => {
    const data  = await redis.get(`url:${shortCode}`)
    if(!data) return null
    const parsed = JSON.parse(data)
    return {...parsed, expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null}
}

export const setCachedUrl = (shortCode: string, longUrl: string, urlId: string, expiresAt: Date | null, clickCount: number) :void => {
 const ttl = expiresAt ? Math.floor((expiresAt.getTime() -Date.now()) / 1000) : env.CACHE_TTL_SECONDS
 if(ttl <=0) return
 redis.set(`url:${shortCode}`, JSON.stringify({ urlId, longUrl, clickCount, expiresAt }), 'EX', ttl)
 .catch(err => console.error('[cache] setCachedUrl failed:', err))
}
