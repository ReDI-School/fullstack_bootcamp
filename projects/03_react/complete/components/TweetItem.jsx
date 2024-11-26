import React from "react";
import Link from "next/link";

const TweetItem = ({ tweet }) => {
  return (
    <article className="border-b border-gray-800 p-4 hover:bg-gray-900 transition-colors cursor-pointer">
      <div className="flex gap-4">
        {/* Profile picture placeholder */}
        <div className="w-12 h-12 rounded-full bg-gray-700 flex-shrink-0" />

        <div className="flex-grow">
          {/* Tweet header */}
          <div className="flex items-center gap-2">
            <Link
              href={`/profile?user=${tweet.user}`}
              className="font-bold hover:underline"
            >
              {tweet.user}
            </Link>
            <span className="text-gray-500">@{tweet.user}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">
              {new Date(tweet.timestamp).toLocaleDateString()}
            </span>
          </div>

          {/* Tweet content */}
          <p className="mt-2 text-white">{tweet.content}</p>

          {/* Tweet actions */}
          <div className="flex justify-between mt-3 max-w-md text-gray-500">
            <button className="hover:text-twitter-blue flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
            <button className="hover:text-green-500 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
            <button className="hover:text-red-500 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default TweetItem;
