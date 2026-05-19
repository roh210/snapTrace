import env from './env';
import { Redis } from 'ioredis';


const redis = new Redis(env.REDIS_URL);

redis.on('ready', () => {
  console.log('Connected to Redis successfully.');
});

redis.on('error', (error) => {
  console.error('Error connecting to Redis:', error);
});

export default redis;