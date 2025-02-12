/**
 * TweetPage.js - Week 6
 * This page displays the details of a single tweet.
 * It fetches a specific tweet based on its ID from the DummyJSON API.
 */
import { notFound } from "next/navigation";

// Fetch a single tweet by ID
async function getTweet(id) {
  const res = await fetch(`https://dummyjson.com/posts/${id}`);
  if (!res.ok) return notFound();
  return res.json();
}

export default async function TweetPage({ params }) {
  const tweet = await getTweet(params.id);

  return (
    <main className="container mx-auto p-6">
      {/* Tweet Title */}
      <h1 className="text-2xl font-bold text-blue-500">{tweet.title}</h1>

      {/* Tweet Content */}
      <p className="text-gray-700 mt-4">{tweet.body}</p>

      {/* Tweet Footer */}
      <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
        <p>
          👍 {tweet.reactions.likes} | 👎 {tweet.reactions.dislikes}
        </p>
        <p className="text-blue-500">{tweet.tags.join(", ")}</p>
      </div>

      {/* Back Button */}
      <a
        href="/"
        className="block text-center mt-6 text-blue-500 hover:underline"
      >
        ⬅️ Back to Tweets
      </a>
    </main>
  );
}
