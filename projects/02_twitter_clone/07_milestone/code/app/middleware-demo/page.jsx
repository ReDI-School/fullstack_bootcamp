"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function MiddlewareDemoPage() {
  const { data: session } = useSession();
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const testProtectedAPI = async () => {
    setLoading(true);
    setApiResponse(null);

    try {
      const response = await fetch("/api/favorites");
      const data = await response.json();

      setApiResponse({
        status: response.status,
        data: data,
      });
    } catch (error) {
      setApiResponse({
        status: "error",
        data: { error: error.message },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          🛡️ Middleware Demo
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            How Middleware Works
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              <strong>Middleware</strong> runs <em>before</em> a request is
              completed. It intercepts requests and can:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Check if a user is authenticated</li>
              <li>Redirect unauthenticated users to login</li>
              <li>Return 401 errors for protected API routes</li>
              <li>Add custom headers or modify requests</li>
              <li>Log requests for analytics</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">
            Current Session Status
          </h3>
          {session ? (
            <div className="space-y-2">
              <p className="text-blue-800 dark:text-blue-200">
                ✅ <strong>Authenticated as:</strong> {session.user.name}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                You can access protected routes and API endpoints.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-blue-800 dark:text-blue-200">
                ❌ <strong>Not authenticated</strong>
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Protected routes will redirect you to login.
              </p>
              <Link href="/login">
                <Button variant="primary" className="mt-2">
                  Login to Test
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Test Protected API Route
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Click the button below to test the <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">/api/favorites</code> endpoint.
            {!session && " Without authentication, you'll get a 401 error."}
          </p>

          <Button
            onClick={testProtectedAPI}
            disabled={loading}
            variant="primary"
          >
            {loading ? "Testing..." : "Test Protected API"}
          </Button>

          {apiResponse && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`font-semibold ${
                    apiResponse.status === 200
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  Status: {apiResponse.status}
                </span>
              </div>
              <pre className="text-sm overflow-x-auto text-gray-800 dark:text-gray-200">
                {JSON.stringify(apiResponse.data, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-yellow-900 dark:text-yellow-100">
            📚 Teaching Points
          </h3>
          <ul className="list-disc list-inside space-y-2 text-yellow-800 dark:text-yellow-200">
            <li>
              <strong>Pages:</strong> Middleware redirects to{" "}
              <code>/login</code>
            </li>
            <li>
              <strong>API Routes:</strong> Middleware returns <code>401</code>{" "}
              Unauthorized
            </li>
            <li>
              <strong>Performance:</strong> Runs at the edge (very fast)
            </li>
            <li>
              <strong>Security:</strong> Protects routes before they execute
            </li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <Link href="/">
            <Button variant="outline">← Back to Home</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
