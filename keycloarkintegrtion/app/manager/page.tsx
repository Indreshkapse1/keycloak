import { requireRoles } from "@/lib/auth-middleware";
import Link from "next/link";

export default async function ManagerPage() {
  const { session, response } = await requireRoles({
    realmRoles: ["manager"],
  });

  if (response) {
    return response;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8 sm:px-10">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-white">Manager Dashboard</h1>
                <p className="mt-1 text-green-100">
                  Restricted to managers only
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-10">
            <div className="space-y-6">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                <div className="flex">
                  <div className="flex-shrink-0">
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
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                      Access Granted
                    </p>
                    <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                      You have manager privileges. Welcome, {session?.user.name}!
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Manager Features
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Team Management
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Manage your team members
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Project Oversight
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Monitor project progress
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Approvals
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Review and approve requests
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Analytics
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      View team analytics
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                  💡 Role Protection Info
                </h3>
                <p className="mt-1 text-sm text-blue-800 dark:text-blue-300">
                  This page is protected by <code className="rounded bg-blue-200 px-1 py-0.5 dark:bg-blue-800">requireRoles()</code> middleware
                  with realm role "manager". Only users with the manager role can access this page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
