"use client";

import { useFavorites } from "@/context/FavoritesContext";

export default function FavoriteButton({ tweetId }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(tweetId);

  return (
    <button
      onClick={() => toggleFavorite(tweetId)}
      className={`text-3xl transition-transform hover:scale-110 ${
        favorite ? "text-yellow-500" : "text-gray-400"
      }`}
      aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      title={favorite ? "Remove from favorites" : "Add to favorites"}
    >
      {favorite ? "⭐" : "☆"}
    </button>
  );
}
