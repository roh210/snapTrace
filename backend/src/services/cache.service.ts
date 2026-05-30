import env from "../config/env";
import redis from "../config/redis";


export const getCachedUrl = async (shortCode: string):Promise<{urlId:string;longUrl:string} |null> => {
    const data  = await redis.get(`url:${shortCode}`)
    if(!data) return null
    return JSON.parse(data) as {urlId:string, longUrl:string}
}

export const setCachedUrl = (shortCode: string, longUrl: string, urlId: string) :void => {
 redis.set(`url:${shortCode}`, JSON.stringify({ urlId, longUrl }), 'EX', env.CACHE_TTL_SECONDS)
 .catch(err => console.error('[cache] setCachedUrl failed:', err))
}
