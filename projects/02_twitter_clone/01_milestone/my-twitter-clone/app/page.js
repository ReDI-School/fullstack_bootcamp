// app/page.js
// 📌 Fetches tweets from DummyJSON API and displays them in the feed.

import Link from "next/link";
import TweetCard from "@/components/TweetCard";

// Function to fetch tweets from DummyJSON API
async function getTweets() {
  const res = await fetch("https://dummyjson.com/posts");
  return res.json();
}

export default async function HomePage() {
  const tweets = await getTweets();

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center my-6">📝 Latest Tweets</h1>

      <div className="space-y-4">
        {tweets.posts.map((tweet) => (
          <Link key={tweet.id} href={`/tweet/${tweet.id}`}>
            <TweetCard tweet={tweet} />
          </Link>
        ))}
      </div>
    </main>
  );
}
