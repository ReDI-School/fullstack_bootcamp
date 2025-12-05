"use client";

import { useFavorites } from "@/context/FavoritesContext";

export default function FavoritesList({ tweets }) {
  const { favoriteTweetIds } = useFavorites();

  // Filter tweets to only show favorites
  const favoriteTweets = tweets.filter((tweet) =>
    favoriteTweetIds.includes(tweet.id)
  );

  if (favoriteTweetIds.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          ⭐ Your Favorites
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          No favorites yet! Click the ☆ icon on tweets to add them here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        ⭐ Your Favorites
        <span className="text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
          {favoriteTweetIds.length}
        </span>
      </h2>
      <div className="space-y-2">
        {favoriteTweets.map((tweet) => (
          <div
            key={tweet.id}
            className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              {tweet.title}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {tweet.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
