import TweetCard from "@/components/TweetCard";
import FavoritesList from "@/components/FavoritesList";
import Link from "next/link";
import { Tweet } from "@/models/Tweet";
import { makeSureDbIsReady } from "@/lib/db";

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;

async function getTweets() {
  // Check if database should be used
  const shouldUseDatabase = process.env.MONGODB_URI && process.env.MONGODB_URI.length > 0;
  
  if (shouldUseDatabase) {
    try {
      await makeSureDbIsReady();
      const tweets = await Tweet.find({}).sort({ createdAt: -1 }).lean();
      
      const formattedTweets = tweets.map((tweet) => ({
        id: tweet._id.toString(),
        title: tweet.title,
        body: tweet.body,
        tags: tweet.tags,
        reactions: tweet.reactions,
        views: tweet.views,
        userId: tweet.userId,
      }));
      
      return { posts: formattedTweets };
    } catch (error) {
      console.warn("⚠️ Database error, falling back to external API:", error.message);
    }
  }

  // Fallback to external API
  const res = await fetch("https://dummyjson.com/posts");
  
  if (!res.ok) {
    throw new Error("Failed to fetch tweets");
  }

  return res.json();
}

export default async function Home() {
  const tweets = await getTweets();
  const generatedAt = new Date().toLocaleString();

  return (
    <main className="container mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center my-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          📝 Latest Tweets
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold">ISR Enabled</span> • Generated at {generatedAt}
        </div>
      </div>
      
      {/* Favorites Section */}
      <div className="mb-8">
        <FavoritesList tweets={tweets.posts} />
      </div>

      {/* All Tweets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tweets.posts.map((tweet) => (
          <Link href={`/tweet/${tweet.id}`} key={tweet.id}>
            <TweetCard tweet={tweet} />
          </Link>
        ))}
      </div>
    </main>
  );
}
