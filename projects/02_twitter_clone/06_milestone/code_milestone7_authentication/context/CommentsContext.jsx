"use client";

import { createContext, useContext, useState } from "react";

const CommentsContext = createContext();

export function CommentsProvider({ children }) {
  // Simple in-memory storage for comments (demo purposes only)
  const [comments, setComments] = useState({});

  const addComment = (tweetId, comment) => {
    setComments((prev) => ({
      ...prev,
      [tweetId]: [...(prev[tweetId] || []), comment],
    }));
  };

  const deleteComment = (tweetId, commentId) => {
    setComments((prev) => ({
      ...prev,
      [tweetId]: (prev[tweetId] || []).filter((c) => c._id !== commentId),
    }));
  };

  const getComments = (tweetId) => {
    return comments[tweetId] || [];
  };

  return (
    <CommentsContext.Provider value={{ comments, addComment, deleteComment, getComments }}>
      {children}
    </CommentsContext.Provider>
  );
}

export function useComments() {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error("useComments must be used within CommentsProvider");
  }
  return context;
}
