"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useComments } from "@/context/CommentsContext";
import Button from "@/components/ui/Button";
import CommentLikeButton from "@/components/CommentLikeButton";

export default function CommentSection({ tweetId }) {
  const { data: session } = useSession();
  const { getComments, addComment, deleteComment } = useComments();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("unknown");

  // Load comments on mount
  useEffect(() => {
    loadComments();
  }, [tweetId]);

  const loadComments = async () => {
    try {
      const res = await fetch(`/api/comments?tweetId=${tweetId}`);
      const data = await res.json();
      
      setSource(data.source);
      
      if (data.source === "database") {
        setComments(data.comments);
      } else {
        // Use Context API for demo mode
        setComments(getComments(tweetId));
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !session) return;

    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tweetId,
          author: session.user.name,
          text: newComment.trim(),
        }),
      });

      const data = await res.json();

      if (data.source === "database") {
        await loadComments();
      } else {
        // Use Context API for demo mode
        addComment(tweetId, data.comment);
        // Update local state immediately
        setComments((prev) => [...prev, data.comment]);
      }

      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const res = await fetch(`/api/comments?commentId=${commentId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.source === "database") {
        await loadComments();
      } else {
        // Use Context API for demo mode
        deleteComment(tweetId, commentId);
        // Update local state immediately
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="text-xl font-bold mb-4 dark:text-white">
        💬 Comments ({comments.length})
        {source === "context" && (
          <span className="text-xs ml-2 text-gray-500">(Demo mode - not persisted)</span>
        )}
      </h2>

      {/* Comment Form */}
      {session ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows="3"
            maxLength="280"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              {newComment.length}/280
            </span>
            <Button type="submit" disabled={loading || !newComment.trim()} variant="primary">
              {loading ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-gray-500 mb-6">Please log in to comment</p>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold dark:text-white">{comment.author}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {session && session.user.name === comment.author && (
                  <Button
                    onClick={() => handleDelete(comment._id)}
                    variant="danger"
                    className="text-xs"
                  >
                    Delete
                  </Button>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3">{comment.text}</p>
              <CommentLikeButton 
                commentId={comment._id} 
                initialLikes={0}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
