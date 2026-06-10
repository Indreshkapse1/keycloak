"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  extractUserAttributes,
  isAdmin,
  isProjectManager,
  isLead,
  getUserAccessLevel,
  getProjectActions,
  getResourceActions,
  canPerformAction,
} from "@/lib/abac";
import { SessionWithRoles } from "@/types/auth";

interface TestProject {
  id: string;
  name: string;
  description: string;
}

interface TestResource {
  id: string;
  name: string;
  description: string;
}

const testProjects: TestProject[] = [
  { id: "1", name: "Project Alpha", description: "Main project initiative" },
  { id: "2", name: "Project Beta", description: "Secondary project" },
  { id: "3", name: "Project Gamma", description: "Research project" },
];

const testResources: TestResource[] = [
  { id: "1", name: "Resource A", description: "Core resource" },
  { id: "2", name: "Resource B", description: "Support resource" },
  { id: "3", name: "Resource C", description: "Utility resource" },
];

export default function ABAC() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userAttributes, setUserAttributes] = useState<any>(null);
  const [accessLevel, setAccessLevel] = useState<string>("");
  const [projectActions, setProjectActions] = useState<string[]>([]);
  const [resourceActions, setResourceActions] = useState<string[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }

    if (session) {
      const attributes = extractUserAttributes(session as SessionWithRoles);
      setUserAttributes(attributes);
      setAccessLevel(getUserAccessLevel(session as SessionWithRoles));
      setProjectActions(getProjectActions(session as SessionWithRoles));
      setResourceActions(getResourceActions(session as SessionWithRoles));
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const sessionWithRoles = session as SessionWithRoles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            🔐 Attribute-Based Access Control (ABAC)
          </h1>
          <p className="text-slate-600">
            Testing role-based access control with user attributes
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">👤 Your Profile</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Username</p>
              <p className="text-lg font-semibold text-slate-900">
                {userAttributes?.username || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Email</p>
              <p className="text-lg font-semibold text-slate-900">
                {userAttributes?.email || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Role</p>
              <p className="text-lg font-semibold text-purple-600 uppercase">
                {userAttributes?.role || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Access Level</p>
              <p className="text-lg font-semibold text-blue-600">
                {accessLevel}
              </p>
            </div>
          </div>
        </div>

        {/* Role Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div
            className={`p-4 rounded-lg ${
              isAdmin(sessionWithRoles)
                ? "bg-red-50 border-2 border-red-200"
                : "bg-slate-50 border-2 border-slate-200"
            }`}
          >
            <p className="text-sm font-semibold text-slate-600">Admin Status</p>
            <p className="text-2xl font-bold mt-2">
              {isAdmin(sessionWithRoles) ? "✅ Yes" : "❌ No"}
            </p>
          </div>
          <div
            className={`p-4 rounded-lg ${
              isProjectManager(sessionWithRoles)
                ? "bg-blue-50 border-2 border-blue-200"
                : "bg-slate-50 border-2 border-slate-200"
            }`}
          >
            <p className="text-sm font-semibold text-slate-600">ProjectManager Status</p>
            <p className="text-2xl font-bold mt-2">
              {isProjectManager(sessionWithRoles) ? "✅ Yes" : "❌ No"}
            </p>
          </div>
          <div
            className={`p-4 rounded-lg ${
              isLead(sessionWithRoles)
                ? "bg-green-50 border-2 border-green-200"
                : "bg-slate-50 border-2 border-slate-200"
            }`}
          >
            <p className="text-sm font-semibold text-slate-600">Lead Status</p>
            <p className="text-2xl font-bold mt-2">
              {isLead(sessionWithRoles) ? "✅ Yes" : "❌ No"}
            </p>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">📊 Projects</h2>
          <div className="mb-4">
            <p className="text-sm text-slate-600 mb-2">Available Actions:</p>
            <div className="flex gap-2 flex-wrap">
              {projectActions.length > 0 ? (
                projectActions.map((action) => (
                  <span
                    key={action}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-semibold"
                  >
                    {action.charAt(0).toUpperCase() + action.slice(1)}
                  </span>
                ))
              ) : (
                <span className="text-slate-400">No actions available</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {testProjects.map((project) => (
              <div
                key={project.id}
                className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-900">{project.name}</p>
                    <p className="text-sm text-slate-600">{project.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold">
                    {projectActions.includes("view") ? "✅ Accessible" : "❌ Denied"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">📦 Resources</h2>
          <div className="mb-4">
            <p className="text-sm text-slate-600 mb-2">Available Actions:</p>
            <div className="flex gap-2 flex-wrap">
              {resourceActions.length > 0 ? (
                resourceActions.map((action) => (
                  <span
                    key={action}
                    className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-semibold"
                  >
                    {action.charAt(0).toUpperCase() + action.slice(1)}
                  </span>
                ))
              ) : (
                <span className="text-slate-400">No actions available</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {testResources.map((resource) => (
              <div
                key={resource.id}
                className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-900">{resource.name}</p>
                    <p className="text-sm text-slate-600">{resource.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
                    {resourceActions.includes("view") ? "✅ Accessible" : "❌ Denied"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Access Rules Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">📋 Access Rules</h2>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="font-semibold text-red-900">👑 Admin (ram)</p>
              <p className="text-sm text-red-800 mt-1">
                Full access to all projects and resources. Can view, create, edit, and delete.
              </p>
            </div>
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="font-semibold text-blue-900">👨‍💼 ProjectManager (alice)</p>
              <p className="text-sm text-blue-800 mt-1">
                Can view all projects and manage them (create, edit). Cannot delete projects.
              </p>
            </div>
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <p className="font-semibold text-green-900">🔗 Lead (bob)</p>
              <p className="text-sm text-green-800 mt-1">
                Can view all resources and manage them (create, edit). Cannot delete resources.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
