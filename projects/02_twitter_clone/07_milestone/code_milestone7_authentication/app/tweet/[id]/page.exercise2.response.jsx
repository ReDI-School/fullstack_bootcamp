import Link from "next/link";
import { Tweet } from "@/models/Tweet";
import { makeSureDbIsReady } from "@/lib/db";
import FavoriteButton from "@/components/FavoriteButton";

// 🎓 ISR CONFIGURATION (for teaching purposes)
// Uncomment ONE of the following to demonstrate different rendering modes:

// ✅ CURRENTLY ACTIVE: ISR with Static Params
// Pre-build pages for tweets 1-30, regenerate every 60 seconds
export async function generateStaticParams() {
  // Pre-build the first 30 tweet pages at build time
  return Array.from({ length: 30 }, (_, i) => ({
    id: String(i + 1),
  }));
}

export const revalidate = 60; // Regenerate pages every 60 seconds

// 🔄 OPTION 1: Pure SSR (Server-Side Rendering)
// Uncomment to fetch fresh data on EVERY request
// export const dynamic = 'force-dynamic';

// 📦 OPTION 2: ISR without pre-building
// Comment out generateStaticParams() to only use on-demand ISR
// Pages are generated on first visit, then cached and revalidated

// 💡 COMPARISON:
// ISR + generateStaticParams: Build 1-30 at build time → Cache → Regenerate every 60s → Fast from day 1 ⚡
// ISR only (revalidate): Generate on demand → Cache → Regenerate every 60s → Slow first visit, fast after 🔄
// SSR (force-dynamic): Fetch every request → Never cached → Always slow but fresh 🐌

async function getTweet(id) {
  // Check if database should be used
  const shouldUseDatabase = process.env.MONGODB_URI && process.env.MONGODB_URI.length > 0;
  
  if (shouldUseDatabase) {
    try {
      await makeSureDbIsReady();
      const tweet = await Tweet.findById(id);
      
      if (tweet) {
        return tweet.toObject();
      }
    } catch (error) {
      console.warn("⚠️ Database error, falling back to external API:", error.message);
    }
  }

  // Fallback to external API
  const res = await fetch(`https://dummyjson.com/posts/${id}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch tweet: ${res.status}`);
  }
  
  const data = await res.json();
  return data;
}

export default async function TweetDetail({ params }) {
  const { id } = await params;
  
  let tweet;
  try {
    tweet = await getTweet(id);
  } catch (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-2">Failed to load tweet</p>
        <p className="text-gray-500 text-sm">{error.message}</p>
        <p className="text-gray-400 text-xs mt-2">The external API might be temporarily unavailable</p>
      </div>
    );
  }

  if (!tweet) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Tweet not found</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-6 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mt-8">
        <div className="flex justify-between items-start gap-4 mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex-1">
            {tweet.title}
          </h1>
          <FavoriteButton tweetId={tweet.id || id} />
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
          {tweet.body}
        </p>
        <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-400 mb-6">
          <span className="flex items-center space-x-2">
            <span>👍</span>
            <span className="font-semibold">{tweet.reactions.likes}</span>
          </span>
          <span className="flex items-center space-x-2">
            <span>👎</span>
            <span className="font-semibold">{tweet.reactions.dislikes}</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {tweet.tags.map((tag) => (
            <span 
              key={tag} 
              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
        <Link 
          href="/" 
          className="inline-block mt-4 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition"
        >
          ← Back to Feed
        </Link>
      </div>
    </main>
  );
}
