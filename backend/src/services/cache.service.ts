import env from "../config/env";
import redis from "../config/redis";


export const getCachedUrl = (shortCode: string) => redis.get(`url:${shortCode}`) 

export const setCachedUrl = (shortCode:string,longUrl:string) => redis.set(`url:${shortCode}`, longUrl, 'EX', env.CACHE_TTL_SECONDS)
