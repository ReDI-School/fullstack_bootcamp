// 📝 EXERCISE 2: Dynamic Routes with ISR
// 
// 🎯 Goal: Convert the static /tweet/5 route to dynamic /tweet/[id] with ISR
//
// 📚 What you'll learn:
// - Dynamic route segments with [id]
// - generateStaticParams() for pre-building pages
// - ISR (Incremental Static Regeneration) for optimal performance
// - Difference between SSR, SSG, and ISR
//
// 💡 Background:
// Currently we have /tweet/5 (static route) that only works for tweet #5
// We need /tweet/[id] (dynamic route) that works for ANY tweet ID
//
// ✅ Your Tasks:
// 1. Add generateStaticParams() to pre-build pages for tweets 1-30
// 2. Add ISR configuration with revalidate = 60
// 3. Make the fetch URL dynamic using the id parameter
//
// 📖 See page.exercise2.response.jsx for the complete solution

import Link from "next/link";
import { Tweet } from "@/models/Tweet";
import { makeSureDbIsReady } from "@/lib/db";
import FavoriteButton from "@/components/FavoriteButton";
import CommentSection from "@/components/CommentSection";
import ReactionButtons from "@/components/ReactionButtons";

// TODO #1: Add generateStaticParams() function
// This tells Next.js which pages to pre-build at build time
//
// Hint:
// export async function generateStaticParams() {
//   return Array.from({ length: 30 }, (_, i) => ({
//     id: String(i + 1),
//   }));
// }
//
// This will pre-build /tweet/1, /tweet/2, ... /tweet/30 at build time
// Other IDs (31+) will be generated on-demand (on first visit)

// TODO #2: Add ISR configuration
// Enable Incremental Static Regeneration with 60-second revalidation
//
// Hint:
// export const revalidate = 60;
//
// This will:
// - Cache the page for 60 seconds
// - After 60s, regenerate in background on next visit
// - Serve cached version while regenerating

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

  // TODO #3: Make this URL dynamic
  // Current: Static URL hardcoded to tweet #5
  // Needed: Dynamic URL using the id parameter
  //
  // Change this line:
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
        
        {/* Reactions */}
        <div className="mb-6">
          <ReactionButtons 
            sourceId={tweet.id || id} 
            sourceType="tweet"
            initialLikes={tweet.reactions?.likes || 0}
            initialDislikes={tweet.reactions?.dislikes || 0}
          />
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

        {/* Comments Section */}
        <CommentSection tweetId={id} />
      </div>
    </main>
  );
}