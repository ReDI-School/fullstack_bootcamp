/**
 * not-found.js - Week 6
 * This component displays a 404 "Not Found" page when users navigate to an unknown route.
 * It provides a clean and user-friendly message with a home navigation link.
 */

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      {/* 404 Message */}
      <h1 className="text-5xl font-bold text-blue-500">404</h1>
      <p className="text-gray-700 mt-2 text-xl">Oops! The page you're looking for doesn't exist.</p>

      {/* Navigation Button */}
      <a href="/" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all">
        Go Back Home
      </a>
    </div>
  );
}
