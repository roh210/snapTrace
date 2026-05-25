import redis from "../config/redis";

const r = redis

export const getCachedUrl = async (shortCode: string) => {
    const cachedData = await r.get(shortCode)
    return cachedData
}

export const setCachedUrl = async(shortCode:string,longUrl:string) =>{
  r.set(shortCode,longUrl,'EX',60)
}