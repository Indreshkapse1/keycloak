"use client";

import { useState } from "react";
import Link from "next/link";

export default function APIExamplePage() {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callAPI = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/protected");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to fetch");
      } else {
        setResponse(data);
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8 sm:px-10">
            <div className="flex items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-white">
                  Role-Protected API Example
                </h1>
                <p className="mt-1 text-purple-100">
                  Test role-based API authentication
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-10">
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Test Protected API Endpoint
                </h2>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Click the button below to call the <code className="rounded bg-gray-200 px-1 py-0.5 dark:bg-gray-700">/api/protected</code> endpoint.
                  This endpoint requires one of the following realm roles: user, admin, or manager.
                </p>

                <button
                  onClick={callAPI}
                  disabled={loading}
                  className="w-full rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-purple-500 dark:hover:bg-purple-600"
                >
                  {loading ? "Loading..." : "Call Protected API"}
                </button>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                  <div className="flex">
                    <svg
                      className="h-5 w-5 text-red-600 dark:text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800 dark:text-red-300">
                        Error
                      </p>
                      <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {response && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                  <div className="mb-3 flex items-center">
                    <svg
                      className="h-5 w-5 text-green-600 dark:text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="ml-2 text-sm font-medium text-green-800 dark:text-green-300">
                      Success! API Response:
                    </p>
                  </div>
                  <pre className="overflow-x-auto rounded bg-green-100 p-3 text-xs text-green-900 dark:bg-green-900/40 dark:text-green-200">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              )}

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                  💡 How It Works
                </h3>
                <p className="mt-2 text-sm text-blue-800 dark:text-blue-300">
                  The API endpoint uses <code className="rounded bg-blue-200 px-1 py-0.5 dark:bg-blue-800">requireRoles()</code> middleware
                  to check if the authenticated user has the required roles before processing the request.
                </p>
                <p className="mt-2 text-sm text-blue-800 dark:text-blue-300">
                  If you don't have the required roles, you'll receive a 403 Forbidden response.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
