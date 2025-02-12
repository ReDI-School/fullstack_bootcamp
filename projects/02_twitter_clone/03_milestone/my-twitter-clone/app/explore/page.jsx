/**
 * Explore.js - Week 6
 * This page allows users to browse trending tweets and topics.
 * It fetches tweets from the DummyJSON API and displays them in a list.
 */
async function getTrendingTweets() {
  const res = await fetch("https://dummyjson.com/posts?limit=10");
  return res.json();
}

export default async function Explore() {
  const tweets = await getTrendingTweets();

  return (
    <main className="container mx-auto p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-blue-500">🔥 Trending Tweets</h1>

      {/* Trending Tweet List */}
      <ul className="mt-6 space-y-6">
        {tweets.posts.map((tweet) => (
          <li
            key={tweet.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <h3 className="text-lg font-bold">{tweet.title}</h3>
            <p className="text-gray-700">{tweet.body}</p>
            <p className="text-sm text-gray-500 mt-2">
              👍 {tweet.reactions.likes} | 👎 {tweet.reactions.dislikes}
            </p>
          </li>
        ))}
      </ul>

      {/* Back Button */}
      <a
        href="/"
        className="block text-center mt-6 text-blue-500 hover:underline"
      >
        ⬅️ Back to Home
      </a>
    </main>
  );
}
