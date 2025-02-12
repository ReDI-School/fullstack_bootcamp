/**
 * page.js - Home Page
 * This page serves as the landing page for the Twitter Clone.
 */

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to Twitter Clone</h1>
      <p className="mt-4 text-gray-700">Share your thoughts with the world in real-time.</p>
      
      {/* Navigation Buttons */}
      <div className="mt-6 space-x-4">
        <Link href="/tweets" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          View Tweets
        </Link>
        <Link href="/profile" className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700">
          Go to Profile
        </Link>
      </div>
    </div>
  );
}
