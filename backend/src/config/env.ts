import 'dotenv/config';
import z from 'zod';

const envSchema = z.object({
    PORT: z.coerce.number(),
    DATABASE_URL: z.string(),
    REDIS_URL: z.string(),
    CACHE_TTL_SECONDS: z.coerce.number(),
    RATE_LIMIT_REQ: z.coerce.number(),
    RATE_LIMIT_WINDOW_SECONDS: z.coerce.number()
})
const env = (() => {
    try {
        return envSchema.parse(process.env);
    } catch (error) {
        console.error('Error parsing environment variables:', error);
        process.exit(1);
    }
})();


export default env;