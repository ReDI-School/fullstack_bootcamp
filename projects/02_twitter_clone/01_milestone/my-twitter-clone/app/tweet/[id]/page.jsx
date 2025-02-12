// app/tweet/[id]/page.js
// 📌 Fetches and displays a single tweet dynamically.

import Link from "next/link";

// Function to fetch a single tweet by ID
async function getTweet(id) {
  const res = await fetch(`https://dummyjson.com/posts/${id}`);
  return res.json();
}

export default async function TweetDetail({ params }) {
  const tweet = await getTweet(params.id);

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">{tweet.title}</h1>
      <p className="text-gray-700 mt-4">{tweet.body}</p>

      <div className="mt-6 text-sm text-gray-600">
        <p>
          👍 {tweet.reactions.likes} | 👎 {tweet.reactions.dislikes}
        </p>
        <p className="text-blue-500">Tags: {tweet.tags.join(", ")}</p>
      </div>

      <Link
        href="/"
        className="inline-block mt-6 text-blue-600 hover:underline"
      >
        ← Back to Feed
      </Link>
    </main>
  );
}
