import { requireAdmin } from "@/lib/auth-middleware";
import Link from "next/link";

export default async function AdminPage() {
  const { session, response } = await requireAdmin();

  if (response) {
    return response;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
          <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-8 sm:px-10">
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
                <p className="mt-1 text-red-100">
                  Restricted to administrators only
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-10">
            <div className="space-y-6">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-600 dark:text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">
                      Access Granted
                    </p>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                      You have administrator privileges. Welcome, {session?.user.name}!
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Admin Features
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      User Management
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Manage user accounts and permissions
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      System Settings
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Configure system-wide settings
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Audit Logs
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      View system activity and logs
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Reports
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Generate and view reports
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                  💡 Role Protection Info
                </h3>
                <p className="mt-1 text-sm text-blue-800 dark:text-blue-300">
                  This page is protected by the <code className="rounded bg-blue-200 px-1 py-0.5 dark:bg-blue-800">requireAdmin()</code> middleware.
                  Only users with "admin" or "administrator" realm roles can access this page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
