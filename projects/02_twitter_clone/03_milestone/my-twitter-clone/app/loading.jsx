/**
 * loading.js - Week 6
 * This component provides a loading state while fetching data in Next.js.
 * It ensures a smooth user experience with a visually appealing loading animation.
 */

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* Loading Animation */}
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      <p className="mt-4 text-gray-700">Loading tweets...</p>
    </div>
  );
}
