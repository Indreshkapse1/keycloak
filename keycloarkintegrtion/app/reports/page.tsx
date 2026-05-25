"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

interface Report {
  id: number;
  name: string;
  value: string;
}

export default function ReportsPage() {
  const { data: session } = useSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [permissions, setPermissions] = useState({
    canView: false,
    canEdit: false,
    canDelete: false,
  });

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please login to view reports</p>
      </div>
    );
  }

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/reports");
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to fetch reports");
        setPermissions({ canView: false, canEdit: false, canDelete: false });
        return;
      }

      setReports(data.data || []);
      setMessage(data.message);
      setPermissions({ canView: true, canEdit: false, canDelete: false });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testEditPermission = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/reports", { method: "PUT" });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Edit permission denied");
        setPermissions((prev) => ({ ...prev, canEdit: false }));
        return;
      }

      setMessage(data.message);
      setPermissions((prev) => ({ ...prev, canEdit: true }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testDeletePermission = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/reports", { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Delete permission denied");
        setPermissions((prev) => ({ ...prev, canDelete: false }));
        return;
      }

      setMessage(data.message);
      setPermissions((prev) => ({ ...prev, canDelete: true }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-white">
                  Reports API Testing
                </h1>
                <p className="mt-1 text-green-100">
                  Resource-based permission testing
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-10">
            <div className="space-y-6">
              {/* User Info */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Logged in as:
                </p>
                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {session?.user?.name || "Unknown User"}
                </p>
              </div>

              {/* Permission Test Buttons */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  🧪 Test Permissions
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={fetchReports}
                    disabled={loading}
                    className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 dark:bg-green-500 dark:hover:bg-green-600"
                  >
                    {loading ? "Testing..." : "Test VIEW Permission"}
                  </button>

                  <button
                    onClick={testEditPermission}
                    disabled={loading}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    {loading ? "Testing..." : "Test EDIT Permission"}
                  </button>

                  <button
                    onClick={testDeletePermission}
                    disabled={loading}
                    className="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600"
                  >
                    {loading ? "Testing..." : "Test DELETE Permission"}
                  </button>
                </div>
              </div>

              {/* Results */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                  <p className="text-sm font-semibold text-red-900 dark:text-red-200">
                    ❌ Permission Denied
                  </p>
                  <p className="mt-1 text-sm text-red-800 dark:text-red-300">
                    {error}
                  </p>
                </div>
              )}

              {message && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                  <p className="text-sm font-semibold text-green-900 dark:text-green-200">
                    ✅ Permission Granted
                  </p>
                  <p className="mt-1 text-sm text-green-800 dark:text-green-300">
                    {message}
                  </p>
                </div>
              )}

              {/* Reports Data */}
              {reports.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
                  <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                    📊 Reports Data
                  </h2>
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-800"
                      >
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {report.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ID: {report.id}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          {report.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Permission Status */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  🔐 Your Permissions
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border border-gray-300 bg-white p-4 text-center dark:border-gray-600 dark:bg-gray-800">
                    <p className="text-2xl">
                      {permissions.canView ? "✅" : "❌"}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                      View
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-300 bg-white p-4 text-center dark:border-gray-600 dark:bg-gray-800">
                    <p className="text-2xl">
                      {permissions.canEdit ? "✅" : "❌"}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                      Edit
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-300 bg-white p-4 text-center dark:border-gray-600 dark:bg-gray-800">
                    <p className="text-2xl">
                      {permissions.canDelete ? "✅" : "❌"}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                      Delete
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                  💡 How This Works
                </h3>
                <p className="mt-2 text-sm text-blue-800 dark:text-blue-300">
                  Each button tests a different permission (view, edit, delete)
                  against the "reports-api" resource in Keycloak. The API will
                  return either success or a permission denied error based on
                  your assigned permissions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
