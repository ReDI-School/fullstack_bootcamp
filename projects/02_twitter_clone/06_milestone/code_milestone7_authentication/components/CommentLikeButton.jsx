"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function CommentLikeButton({ commentId, initialLikes = 0 }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load likes from API when using database
  useEffect(() => {
    loadLikes();
  }, [commentId]);

  const loadLikes = async () => {
    try {
      const res = await fetch(`/api/reactions?sourceId=${commentId}&sourceType=comment`);
      const data = await res.json();
      
      if (data.source === "database") {
        setLikes(data.likes);
        
        // Check if current user has liked this comment
        if (session) {
          const myReaction = data.reactions.find(
            r => r.author === session.user.name && r.type === "like"
          );
          setIsLiked(!!myReaction);
        }
      } else {
        // Fallback mode - use initial values
        setLikes(initialLikes);
      }
    } catch (error) {
      console.error("Error loading likes:", error);
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId: commentId,
          sourceType: "comment",
          author: session.user.name,
          type: "like",
        }),
      });

      const data = await res.json();

      if (data.source === "database") {
        // Reload likes from database
        await loadLikes();
      } else {
        // Fallback mode - update locally
        if (data.action === "removed") {
          // User unliked
          setLikes(prev => Math.max(0, prev - 1));
          setIsLiked(false);
        } else {
          // User liked
          setLikes(prev => prev + 1);
          setIsLiked(true);
        }
      }
    } catch (error) {
      console.error("Error handling like:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={!session || loading}
      className={`flex items-center space-x-1 transition ${
        isLiked
          ? "text-red-500 dark:text-red-400"
          : "text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
      } ${!session ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      title={!session ? "Login to like" : isLiked ? "Unlike" : "Like"}
    >
      <span className="text-lg">{isLiked ? "❤️" : "🤍"}</span>
      {likes > 0 && <span className="text-sm font-semibold">{likes}</span>}
    </button>
  );
}
