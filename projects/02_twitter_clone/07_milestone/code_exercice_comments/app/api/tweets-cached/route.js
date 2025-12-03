import { getRedisClient } from "@/lib/redis";

const CACHE_KEY = "tweets:all";
const CACHE_DURATION = 60; // 60 seconds

export async function GET() {
  const redis = getRedisClient();
  
  try {
    // Try to get cached data
    const cachedPosts = await redis.get(CACHE_KEY);

    if (cachedPosts) {
      console.log("✅ Serving from Redis cache");
      return Response.json({
        posts: JSON.parse(cachedPosts).posts,
        cached: true,
        timestamp: new Date().toISOString()
      });
    }

    // Fetch fresh data
    console.log("🔄 Cache miss - fetching fresh data...");
    const res = await fetch("https://dummyjson.com/posts");
    const data = await res.json();

    // Store in cache with expiration
    await redis.set(CACHE_KEY, JSON.stringify(data), "EX", CACHE_DURATION);

    return Response.json({
      posts: data.posts,
      cached: false,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("❌ Redis error:", error);
    
    // Fallback to direct fetch if Redis fails
    const res = await fetch("https://dummyjson.com/posts");
    const data = await res.json();
    
    return Response.json({
      posts: data.posts,
      cached: false,
      error: "Cache unavailable",
      timestamp: new Date().toISOString()
    });
  }
}
