"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ReactionButtons({ sourceId, sourceType = "tweet", initialLikes = 0, initialDislikes = 0 }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userReaction, setUserReaction] = useState(null); // "like", "dislike", or null
  const [loading, setLoading] = useState(false);

  // Load reactions from API when using database
  useEffect(() => {
    loadReactions();
  }, [sourceId]);

  const loadReactions = async () => {
    try {
      const res = await fetch(`/api/reactions?sourceId=${sourceId}&sourceType=${sourceType}`);
      const data = await res.json();
      
      if (data.source === "database") {
        setLikes(data.likes);
        setDislikes(data.dislikes);
        
        // Check if current user has reacted
        if (session) {
          const myReaction = data.reactions.find(r => r.author === session.user.name);
          setUserReaction(myReaction ? myReaction.type : null);
        }
      } else {
        // Fallback mode - use initial values from tweet data
        setLikes(initialLikes);
        setDislikes(initialDislikes);
      }
    } catch (error) {
      console.error("Error loading reactions:", error);
    }
  };

  const handleReaction = async (type) => {
    if (!session || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId,
          sourceType,
          author: session.user.name,
          type,
        }),
      });

      const data = await res.json();

      if (data.source === "database") {
        // Reload reactions from database
        await loadReactions();
      } else {
        // Fallback mode - update locally
        if (data.action === "removed") {
          // User clicked same reaction - remove it
          if (type === "like") {
            setLikes(prev => Math.max(0, prev - 1));
          } else {
            setDislikes(prev => Math.max(0, prev - 1));
          }
          setUserReaction(null);
        } else if (data.action === "updated") {
          // User switched reaction
          if (type === "like") {
            setLikes(prev => prev + 1);
            setDislikes(prev => Math.max(0, prev - 1));
          } else {
            setDislikes(prev => prev + 1);
            setLikes(prev => Math.max(0, prev - 1));
          }
          setUserReaction(type);
        } else {
          // New reaction
          if (type === "like") {
            setLikes(prev => prev + 1);
          } else {
            setDislikes(prev => prev + 1);
          }
          setUserReaction(type);
        }
      }
    } catch (error) {
      console.error("Error handling reaction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-6">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleReaction("like");
        }}
        disabled={!session || loading}
        className={`flex items-center space-x-2 transition ${
          userReaction === "like"
            ? "text-blue-600 dark:text-blue-400 font-bold"
            : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        } ${!session ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        title={!session ? "Login to react" : "Like"}
      >
        <span className="text-xl">👍</span>
        <span className="font-semibold">{likes}</span>
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleReaction("dislike");
        }}
        disabled={!session || loading}
        className={`flex items-center space-x-2 transition ${
          userReaction === "dislike"
            ? "text-red-600 dark:text-red-400 font-bold"
            : "text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
        } ${!session ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        title={!session ? "Login to react" : "Dislike"}
      >
        <span className="text-xl">👎</span>
        <span className="font-semibold">{dislikes}</span>
      </button>
    </div>
  );
}
