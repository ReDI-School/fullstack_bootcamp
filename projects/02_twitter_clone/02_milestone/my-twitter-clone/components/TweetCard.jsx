/**
 * TweetCard.js - Week 6
 * This component represents an individual tweet within the Twitter Clone.
 * It displays the tweet's content, author, and interactive features such as likes.
 */

export default function TweetCard({ tweet }) {
  return (
    <div className="tweet-card">
      {/* Tweet Title */}
      <h3 className="text-lg font-bold">{tweet.title}</h3>

      {/* Tweet Body */}
      <p className="text-gray-700 mt-2">{tweet.body}</p>

      {/* Tweet Footer - Likes and Tags */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <p>👍 {tweet.reactions.likes} | 👎 {tweet.reactions.dislikes}</p>
        <p className="text-blue-500">{tweet.tags.join(", ")}</p>
      </div>
    </div>
  );
}
