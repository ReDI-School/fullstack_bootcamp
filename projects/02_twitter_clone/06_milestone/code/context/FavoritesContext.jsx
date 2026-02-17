"use client";

import { createContext, useState, useContext, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const { data: session } = useSession();
  const userId = useMemo(() => session?.user?.id || "guest", [session?.user?.id]);

  // Initialize state with user-specific favorites
  const [favoriteTweetIds, setFavoriteTweetIds] = useState(() => {
    if (typeof window !== "undefined") {
      const storageKey = `favoriteTweets_${userId}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (error) {
          console.error("Failed to load favorites:", error);
        }
      }
    }
    return [];
  });

  // Save favorites to localStorage whenever they change (per user)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storageKey = `favoriteTweets_${userId}`;
      localStorage.setItem(storageKey, JSON.stringify(favoriteTweetIds));
    }
  }, [favoriteTweetIds, userId]);

  const addToFavorites = (tweetId) => {
    setFavoriteTweetIds((prev) => {
      if (prev.includes(tweetId)) return prev;
      return [...prev, tweetId];
    });
  };

  const removeFromFavorites = (tweetId) => {
    setFavoriteTweetIds((prev) => prev.filter((id) => id !== tweetId));
  };

  const toggleFavorite = (tweetId) => {
    setFavoriteTweetIds((prev) =>
      prev.includes(tweetId)
        ? prev.filter((id) => id !== tweetId)
        : [...prev, tweetId]
    );
  };

  const isFavorite = (tweetId) => favoriteTweetIds.includes(tweetId);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteTweetIds,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
