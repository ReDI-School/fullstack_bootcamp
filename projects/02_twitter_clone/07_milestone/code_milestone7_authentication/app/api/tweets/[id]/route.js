import { makeSureDbIsReady } from "@/lib/db.js";
import { Tweet } from "@/models/Tweet.js";

export async function GET(request, { params }) {
  const { id } = await params;
  
  // Check if database should be used (skip if MONGODB_URI is not set)
  const shouldUseDatabase = process.env.MONGODB_URI && process.env.MONGODB_URI.length > 0;

  if (shouldUseDatabase) {
    try {
      // Try to get tweet from database
      await makeSureDbIsReady();
      const tweet = await Tweet.findById(id);

      if (tweet) {
        return Response.json(tweet);
      }
    } catch (error) {
      console.warn("⚠️ Database error, falling back to external API:", error.message);
    }
  }

  // Fallback to external API
  try {
    const response = await fetch(`https://dummyjson.com/posts/${id}`);
    
    if (!response.ok) {
      return Response.json({ error: "Tweet not found" }, { status: 404 });
    }
    
    const tweet = await response.json();
    return Response.json(tweet);
  } catch (error) {
    console.error("❌ External API error:", error);
    return Response.json(
      { error: "Failed to fetch tweet" },
      { status: 500 }
    );
  }
}
