import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardClientLogger from "./DashboardClientLogger";
import { handleLogout } from "@/app/actions/logout";
import Link from "next/link";
import { SessionWithRoles } from "@/types/auth";
import { checkRoles } from "@/lib/roles";

export default async function DashboardPage() {
  console.log("[AUTH SERVER] Dashboard page accessed");
  const session = (await auth()) as SessionWithRoles | null;
  console.log("[AUTH SERVER] Session retrieved:", session);

  if (!session?.user) {
    console.log("[AUTH SERVER] No valid session - redirecting to login");
    redirect("/login");
  }

  console.log("[AUTH SERVER] Valid session found for user:", session.user);
  
  const roleChecker = checkRoles(session);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <DashboardClientLogger session={session} />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 sm:px-10">
            <h1 className="text-3xl font-bold text-white">
              Welcome to Your Dashboard
            </h1>
            <p className="mt-2 text-indigo-100">
              Successfully authenticated with Keycloak
            </p>
          </div>

          <div className="px-6 py-8 sm:px-10">
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  User Information
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                      <svg
                        className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Username
                      </p>
                      <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {session.user.name || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                      <svg
                        className="h-6 w-6 text-purple-600 dark:text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Email Address
                      </p>
                      <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {session.user.email || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                      <svg
                        className="h-6 w-6 text-amber-600 dark:text-amber-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Assigned Roles
                      </p>
                      <div className="mt-3 space-y-3">
                        {(session.user as any).roles &&
                        typeof (session.user as any).roles === "object" ? (
                          Object.keys((session.user as any).roles).map(
                            (clientId) => {
                              const roles = (session.user as any).roles[
                                clientId
                              ];
                              if (!roles || roles.length === 0) return null;

                              return (
                                <div key={clientId} className="space-y-1">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                                    {clientId === "realm"
                                      ? "🌐 Realm Roles"
                                      : `🔑 ${clientId}`}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {roles.map((role: string) => (
                                      <span
                                        key={`${clientId}-${role}`}
                                        className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                                      >
                                        {role}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              );
                            },
                          )
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            No roles assigned
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
                      Authentication Status: Active
                    </p>
                    <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                      You are successfully authenticated via Keycloak
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Role-Protected Pages
                </h2>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Try accessing these pages based on your assigned roles:
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {roleChecker.isAdmin() && (
                    <Link
                      href="/admin"
                      className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 transition-all hover:border-red-300 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:hover:bg-red-900/30"
                    >
                      <div>
                        <p className="font-semibold text-red-900 dark:text-red-200">
                          Admin Panel
                        </p>
                        <p className="text-xs text-red-700 dark:text-red-400">
                          Requires: admin role
                        </p>
                      </div>
                      <svg
                        className="h-5 w-5 text-red-600 dark:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  )}
                  
                  {roleChecker.hasRealmRole("manager") && (
                    <Link
                      href="/manager"
                      className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 transition-all hover:border-green-300 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:hover:bg-green-900/30"
                    >
                      <div>
                        <p className="font-semibold text-green-900 dark:text-green-200">
                          Manager Dashboard
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-400">
                          Requires: manager role
                        </p>
                      </div>
                      <svg
                        className="h-5 w-5 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  )}
                  
                  {roleChecker.hasClientRole("myclient", "client-admin") && (
                    <Link
                      href="/client-admin"
                      className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4 transition-all hover:border-blue-300 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:hover:bg-blue-900/30"
                    >
                      <div>
                        <p className="font-semibold text-blue-900 dark:text-blue-200">
                          Client Admin
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-400">
                          Requires: myclient/client-admin
                        </p>
                      </div>
                      <svg
                        className="h-5 w-5 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  )}
                  
                  <Link
                    href="/api-example"
                    className="flex items-center justify-between rounded-lg border border-purple-200 bg-purple-50 p-4 transition-all hover:border-purple-300 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-900/20 dark:hover:bg-purple-900/30"
                  >
                    <div>
                      <p className="font-semibold text-purple-900 dark:text-purple-200">
                        API Example
                      </p>
                      <p className="text-xs text-purple-700 dark:text-purple-400">
                        Role-protected API route
                      </p>
                    </div>
                    <svg
                      className="h-5 w-5 text-purple-600 dark:text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                  
                  <Link
                    href="/documents"
                    className="flex items-center justify-between rounded-lg border border-indigo-200 bg-indigo-50 p-4 transition-all hover:border-indigo-300 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30"
                  >
                    <div>
                      <p className="font-semibold text-indigo-900 dark:text-indigo-200">
                        📄 Document Management
                      </p>
                      <p className="text-xs text-indigo-700 dark:text-indigo-400">
                        Resource-based permissions
                      </p>
                    </div>
                    <svg
                      className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>

                  <Link
                    href="/reports"
                    className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 transition-all hover:border-green-300 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:hover:bg-green-900/30"
                  >
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-200">
                        📊 Reports API Testing
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-400">
                        Test view, edit, delete permissions
                      </p>
                    </div>
                    <svg
                      className="h-5 w-5 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
                
                {!roleChecker.isAdmin() && !roleChecker.hasRealmRole("manager") && !roleChecker.hasClientRole("myclient", "client-admin") && (
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      💡 You don't have any special roles assigned. Contact your administrator to access protected pages.
                    </p>
                  </div>
                )}
              </div>

              <form action={handleLogout}>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-500 dark:hover:bg-red-600"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
