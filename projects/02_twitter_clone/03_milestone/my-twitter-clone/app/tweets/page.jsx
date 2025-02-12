/**
 * tweets/page.js - Tweets Feed Page
 * This page fetches and displays a list of tweets from the DummyJSON API.
 */
"use client";
import { useState, useEffect } from "react";
import TweetCard from "@/components/TweetCard";

export default function TweetsPage() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTweets() {
      try {
        const response = await fetch("https://dummyjson.com/posts");
        const data = await response.json();
        setTweets(data.posts);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTweets();
  }, []);

  return (
    <div className="container mx-auto py-6 rounded-lg">
      <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">
        Latest Tweets
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading tweets...</p>
      ) : (
        <div className="space-y-4 flex flex-col">
          {tweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </div>
      )}
    </div>
  );
}
