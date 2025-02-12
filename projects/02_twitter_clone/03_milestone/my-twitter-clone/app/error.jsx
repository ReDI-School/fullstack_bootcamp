/**
 * error.js - Week 6
 * This component handles and displays error messages globally.
 * It provides a user-friendly message when an error occurs.
 */

"use client"; // Required for Next.js Client Components

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      {/* Error Message */}
      <h1 className="text-3xl font-bold text-red-500">⚠️ Oops! Something went wrong.</h1>
      <p className="text-gray-700 mt-2">We encountered an unexpected issue. Please try again.</p>

      {/* Retry Button */}
      <button
        onClick={reset}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
      >
        Try Again
      </button>
    </div>
  );
}
