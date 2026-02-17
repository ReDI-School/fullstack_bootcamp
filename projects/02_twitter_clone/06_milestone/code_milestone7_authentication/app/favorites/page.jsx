"use client";

import { useFavorites } from "@/context/FavoritesContext";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import TweetCard from "@/components/TweetCard";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function FavoritesPage() {
  const { favoriteTweetIds } = useFavorites();
  const { data: session } = useSession();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavoriteTweets() {
      if (favoriteTweetIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Fetch all tweets and filter favorites
        const res = await fetch("https://dummyjson.com/posts");
        const data = await res.json();
        const favorited = data.posts.filter((tweet) =>
          favoriteTweetIds.includes(tweet.id)
        );
        setTweets(favorited);
      } catch (error) {
        console.error("Failed to fetch tweets:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFavoriteTweets();
  }, [favoriteTweetIds]);

  if (loading) {
    return (
      <main className="container mx-auto p-6 min-h-screen">
        <h1 className="text-3xl font-bold text-center my-6 text-gray-900 dark:text-white">
          ⭐ My Favorites
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400">Loading...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          ⭐ My Favorites
        </h1>
        {session && (
          <span className="text-gray-600 dark:text-gray-400">
            Logged in as <span className="font-semibold">{session.user.name}</span>
          </span>
        )}
      </div>

      {favoriteTweetIds.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-6xl mb-4">⭐</p>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">
            No favorites yet
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start adding tweets to your favorites!
          </p>
          <Link href="/">
            <Button variant="primary">
              Browse Tweets
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tweets.map((tweet) => (
            <Link href={`/tweet/${tweet.id}`} key={tweet.id}>
              <TweetCard tweet={tweet} />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
