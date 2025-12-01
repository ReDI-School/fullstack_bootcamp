"use client";

import { useFavorites } from "@/context/FavoritesContext";

export default function TweetCard({ tweet }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(tweet.id);

  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-all bg-white dark:bg-gray-800 cursor-pointer">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{tweet.title}</h3>
          <p className="text-gray-700 dark:text-gray-300 mt-2">{tweet.body}</p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(tweet.id);
          }}
          className={`text-2xl transition-transform hover:scale-110 ${favorite ? "text-yellow-500" : "text-gray-400"}`}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          title={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          {favorite ? "⭐" : "☆"}
        </button>
      </div>
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>
          👍 {tweet.reactions.likes} | 👎 {tweet.reactions.dislikes}
        </p>
        <p className="text-blue-500 dark:text-blue-400">{tweet.tags.join(", ")}</p>
      </div>
    </div>
  );
}