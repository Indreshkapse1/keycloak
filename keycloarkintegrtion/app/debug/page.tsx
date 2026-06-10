"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DebugPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }

    if (session) {
      const user = session.user as any;
      const accessToken = (session as any).accessToken;

      // Decode access token
      let decodedToken = null;
      if (accessToken) {
        try {
          const base64Url = accessToken.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            Buffer.from(base64, "base64")
              .toString()
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          decodedToken = JSON.parse(jsonPayload);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }

      setTokenInfo({
        user,
        decodedToken,
        accessToken: accessToken ? accessToken.substring(0, 50) + "..." : "N/A",
      });
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">🔍 Debug Information</h1>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">👤 User Info</h2>
          <pre className="bg-slate-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(tokenInfo?.user, null, 2)}
          </pre>
        </div>

        {/* Decoded Token */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">🔐 Decoded Access Token</h2>
          <div className="space-y-4">
            {tokenInfo?.decodedToken ? (
              <>
                {/* Check for role claim */}
                <div className="p-4 border border-slate-200 rounded">
                  <p className="font-semibold text-slate-900">Top-level 'role' claim:</p>
                  <p className="text-lg font-mono text-blue-600 mt-2">
                    {tokenInfo.decodedToken.role ? (
                      <span className="text-green-600">✅ {tokenInfo.decodedToken.role}</span>
                    ) : (
                      <span className="text-red-600">❌ NOT FOUND</span>
                    )}
                  </p>
                </div>

                {/* Check for realm_access.roles */}
                <div className="p-4 border border-slate-200 rounded">
                  <p className="font-semibold text-slate-900">realm_access.roles:</p>
                  <p className="text-lg font-mono text-blue-600 mt-2">
                    {tokenInfo.decodedToken.realm_access?.roles ? (
                      <span className="text-green-600">
                        ✅ {JSON.stringify(tokenInfo.decodedToken.realm_access.roles)}
                      </span>
                    ) : (
                      <span className="text-red-600">❌ NOT FOUND</span>
                    )}
                  </p>
                </div>

                {/* Full token */}
                <div className="p-4 border border-slate-200 rounded">
                  <p className="font-semibold text-slate-900 mb-2">Full Token Claims:</p>
                  <pre className="bg-slate-100 p-4 rounded overflow-auto text-xs max-h-96">
                    {JSON.stringify(tokenInfo.decodedToken, null, 2)}
                  </pre>
                </div>
              </>
            ) : (
              <p className="text-red-600">Could not decode token</p>
            )}
          </div>
        </div>

        {/* Troubleshooting Guide */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">🔧 Troubleshooting</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="font-semibold text-blue-900">✅ If you see 'role' claim:</p>
              <p className="text-sm text-blue-800 mt-1">
                Token mapper is working! The ABAC code should work correctly.
              </p>
            </div>

            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="font-semibold text-red-900">❌ If 'role' claim is NOT found:</p>
              <p className="text-sm text-red-800 mt-1">
                The token mapper is not configured. Follow these steps:
              </p>
              <ol className="text-sm text-red-800 mt-2 ml-4 list-decimal">
                <li>Go to Keycloak Admin Console</li>
                <li>Navigate to Clients → my-app → Client Scopes</li>
                <li>Click "roles" scope</li>
                <li>Go to Mappers tab → Add mapper → By configuration</li>
                <li>Select "User Attribute"</li>
                <li>Configure:
                  <ul className="ml-4 mt-1">
                    <li>Name: <code className="bg-red-100 px-2 py-1 rounded">role</code></li>
                    <li>User Attribute Name: <code className="bg-red-100 px-2 py-1 rounded">role</code></li>
                    <li>Token Claim Name: <code className="bg-red-100 px-2 py-1 rounded">role</code></li>
                    <li>Add to ID token: ON</li>
                    <li>Add to access token: ON</li>
                  </ul>
                </li>
                <li>Click Save</li>
                <li>Logout and login again</li>
              </ol>
            </div>

            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <p className="font-semibold text-yellow-900">⚠️ If you see realm_access.roles:</p>
              <p className="text-sm text-yellow-800 mt-1">
                You have realm roles assigned. The ABAC code will use these instead of custom attributes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
