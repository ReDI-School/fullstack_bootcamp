/**
 * TweetCard.js - Component for displaying individual tweets
 * This component renders a tweet with user details, content, likes, and comments.
 */

import Link from "next/link";

export default function TweetCard({ tweet }) {
  return (
    <Link href={`/tweet/${tweet.id}`}>
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        {/* Tweet Title */}
        <h2 className="text-lg font-semibold text-blue-700">{tweet.title}</h2>

        {/* Tweet Body */}
        <p className="text-gray-800 mt-2">{tweet.body}</p>

        {/* Tweet Meta */}
        <div className="mt-4 flex justify-between items-center text-gray-600 text-sm">
          <span>👍 {tweet.reactions.likes} Likes</span>
          <span>👎 {tweet.reactions.dislikes} Dislikes</span>
          <span>👁️ {tweet.views} Views</span>
        </div>
      </div>
    </Link>
  );
}
