import Link from "next/link";
import { Tweet } from "@/models/Tweet";
import { makeSureDbIsReady } from "@/lib/db";
import FavoriteButton from "@/components/FavoriteButton";

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
  return res.json();
}

export default async function TweetDetail({ params }) {
    const { id } = await params;
    const tweet = await getTweet(id);

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