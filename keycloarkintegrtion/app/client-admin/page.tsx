import { requireClientRole } from "@/lib/auth-middleware";
import Link from "next/link";

export default async function ClientSpecificPage() {
  const { session, response } = await requireClientRole("myclient", "client-admin");

  if (response) {
    return response;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-8 sm:px-10">
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
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-white">Client Admin Panel</h1>
                <p className="mt-1 text-blue-100">
                  Client-specific role protection
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-10">
            <div className="space-y-6">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-600 dark:text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Client Role Access Granted
                    </p>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                      You have "client-admin" role for the "myclient" client. Welcome, {session?.user.name}!
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Client-Specific Features
                </h2>
                <div className="space-y-3">
                  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Client Configuration
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Manage settings specific to the "myclient" application
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Client Users
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Manage users with access to this client
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Client Analytics
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      View analytics specific to this client application
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                  💡 Client Role Protection Info
                </h3>
                <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
                  This page is protected by <code className="rounded bg-amber-200 px-1 py-0.5 dark:bg-amber-800">requireClientRole("myclient", "client-admin")</code> middleware.
                  Only users with the "client-admin" role for the "myclient" client can access this page.
                </p>
                <p className="mt-2 text-sm text-amber-800 dark:text-amber-300">
                  <strong>Note:</strong> Client roles are different from realm roles. They are specific to individual Keycloak clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
