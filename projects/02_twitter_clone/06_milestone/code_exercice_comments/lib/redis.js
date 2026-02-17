import Redis from "ioredis";

let redis = null;

export function getRedisClient() {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
    
    redis.on('error', (err) => {
      console.error('❌ Redis error:', err.message);
    });
    
    redis.on('connect', () => {
      console.log('✅ Redis connected');
    });
  }
  
  return redis;
}
