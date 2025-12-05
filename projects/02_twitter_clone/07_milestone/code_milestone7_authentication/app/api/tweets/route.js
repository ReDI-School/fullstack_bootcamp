import { makeSureDbIsReady } from "@/lib/db";
import { Tweet } from "@/models/Tweet";

export async function GET() {
  // Check if database should be used (skip if MONGODB_URI is not set)
  const shouldUseDatabase = process.env.MONGODB_URI && process.env.MONGODB_URI.length > 0;
  
  let dbAvailable = false;

  if (shouldUseDatabase) {
    try {
      // Try to connect to database
      await makeSureDbIsReady();
      dbAvailable = true;
    } catch (dbError) {
      console.warn("⚠️ Database not available, will use external API:", dbError.message);
    }
  }

  // If database is available, try to get tweets from it
  if (dbAvailable) {
    try {
      const tweetsCount = await Tweet.countDocuments();

      if (tweetsCount > 0) {
        // We have tweets in DB, return them
        console.log("💾 Fetching tweets from database...");
        const tweets = await Tweet.find({}).sort({ createdAt: -1 }).lean();

        // Transform to match the expected format
        const formattedTweets = tweets.map((tweet) => ({
          id: tweet._id.toString(),
          title: tweet.title,
          body: tweet.body,
          tags: tweet.tags,
          reactions: tweet.reactions,
          views: tweet.views,
          userId: tweet.userId,
        }));

        return Response.json({ posts: formattedTweets }, { status: 200 });
      }
    } catch (dbQueryError) {
      console.warn("⚠️ Error querying database, falling back to external API:", dbQueryError.message);
      dbAvailable = false;
    }
  }

  // Either DB is not available OR DB is empty - fetch from external API
  try {
    console.log("📥 Fetching tweets from external API...");
    const res = await fetch("https://dummyjson.com/posts");
    
    if (!res.ok) {
      throw new Error(`External API returned ${res.status}`);
    }
    
    const data = await res.json();

    // If database is available, try to save the tweets
    if (dbAvailable) {
      try {
        const tweetsToSave = data.posts.map((post) => ({
          title: post.title,
          body: post.body,
          tags: post.tags || [],
          reactions: {
            likes: post.reactions?.likes || 0,
            dislikes: post.reactions?.dislikes || 0,
          },
          views: post.views || 0,
          userId: post.userId,
        }));

        await Tweet.insertMany(tweetsToSave);
        console.log(`✅ Saved ${tweetsToSave.length} tweets to database`);
      } catch (saveError) {
        console.warn("⚠️ Could not save tweets to database:", saveError.message);
        // Continue anyway - we have the data from the API
      }
    }

    // Return the fetched data
    return Response.json({ posts: data.posts }, { status: 200 });
  } catch (apiError) {
    console.error("❌ Error fetching from external API:", apiError);
    return Response.json(
      { 
        error: "Failed to fetch tweets", 
        message: "Both database and external API are unavailable",
        details: apiError.message 
      },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new tweet
export async function POST(req) {
  try {
    await makeSureDbIsReady();
    const body = await req.json();

    const newTweet = await Tweet.create(body);
    return Response.json(newTweet.toObject(), { status: 201 });
  } catch (error) {
    console.error("❌ Error creating tweet:", error);
    return Response.json(
      { error: "Error creating tweet", message: error.message },
      { status: 500 }
    );
  }
}

// DELETE endpoint to clear all tweets (useful for testing)
export async function DELETE() {
  try {
    await makeSureDbIsReady();
    const result = await Tweet.deleteMany({});
    return Response.json(
      { message: `Deleted ${result.deletedCount} tweets` },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting tweets:", error);
    return Response.json(
      { error: "Error deleting tweets", message: error.message },
      { status: 500 }
    );
  }
}
