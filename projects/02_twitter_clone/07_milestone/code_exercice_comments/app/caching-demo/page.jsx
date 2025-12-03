"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function CachingDemo() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const testCache = async () => {
    setLoading(true);
    const start = Date.now();
    
    try {
      const res = await fetch("/api/tweets-cached");
      const data = await res.json();
      const duration = Date.now() - start;
      
      setResponse({ ...data, duration });
    } catch (error) {
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🚀 API Caching Demo with Redis</h1>
      
      <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 p-4 mb-6 rounded">
        <h2 className="font-bold mb-2 dark:text-white">How it works:</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm dark:text-gray-200">
          <li><strong>First request:</strong> Fetches from API, stores in Redis (slower)</li>
          <li><strong>Next 60 seconds:</strong> Serves from Redis cache (instant ⚡)</li>
          <li><strong>After 60 seconds:</strong> Cache expires, fetches fresh data</li>
        </ol>
      </div>

      <Button onClick={testCache} disabled={loading} variant="primary">
        {loading ? "Testing..." : "Test API Cache"}
      </Button>

      {response && (
        <div className={`mt-6 p-4 rounded-lg ${
          response.cached 
            ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700' 
            : 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{response.cached ? "⚡" : "🔄"}</span>
            <h3 className="font-bold text-lg dark:text-white">
              {response.cached ? "Served from Redis Cache" : "Fresh API Fetch"}
            </h3>
          </div>
          
          <div className="space-y-2 text-sm dark:text-gray-200">
            <p><strong>Response Time:</strong> {response.duration}ms</p>
            <p><strong>Timestamp:</strong> {response.timestamp}</p>
            <p><strong>Tweets Count:</strong> {response.posts?.length || 0}</p>
            {response.error && (
              <p className="text-red-600 dark:text-red-400"><strong>Error:</strong> {response.error}</p>
            )}
          </div>

          <p className="mt-4 text-xs text-gray-600 dark:text-gray-400">
            💡 Click multiple times quickly to see caching in action!
          </p>
        </div>
      )}

      <div className="mt-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="font-bold mb-2 dark:text-white">📊 Performance Comparison:</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left py-2 dark:text-white">Method</th>
              <th className="text-left py-2 dark:text-white">Speed</th>
              <th className="text-left py-2 dark:text-white">Freshness</th>
            </tr>
          </thead>
          <tbody className="dark:text-gray-200">
            <tr className="border-b dark:border-gray-700">
              <td className="py-2">No Cache (SSR)</td>
              <td className="py-2">🐌 Slow (500-1000ms)</td>
              <td className="py-2">✅ Always fresh</td>
            </tr>
            <tr className="border-b dark:border-gray-700">
              <td className="py-2">Redis Cache</td>
              <td className="py-2">⚡ Fast (10-50ms)</td>
              <td className="py-2">⚠️ Fresh every 60s</td>
            </tr>
            <tr>
              <td className="py-2">ISR (Next.js)</td>
              <td className="py-2">⚡ Fast (cached HTML)</td>
              <td className="py-2">⚠️ Fresh every 60s</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="font-bold mb-2 dark:text-white">🛠 Setup Instructions:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm dark:text-gray-200">
          <li>Install Redis client: <code className="bg-white dark:bg-gray-700 px-2 py-1 rounded">npm install ioredis</code></li>
          <li>Start Redis: <code className="bg-white dark:bg-gray-700 px-2 py-1 rounded">docker-compose up -d</code></li>
          <li>Add to .env.local: <code className="bg-white dark:bg-gray-700 px-2 py-1 rounded">REDIS_URL=redis://localhost:6379</code></li>
          <li>Restart Next.js: <code className="bg-white dark:bg-gray-700 px-2 py-1 rounded">npm run dev</code></li>
        </ol>
      </div>

      <div className="mt-6">
        <Link href="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
