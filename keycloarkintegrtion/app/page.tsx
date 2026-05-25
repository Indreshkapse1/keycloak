import { auth, signIn } from "@/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  // If user is logged in, redirect to dashboard
  if (session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-green-100 p-4">
            <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Welcome back!</h1>
          <p className="mb-6 text-gray-600">You are signed in as {session.user.name || session.user.email}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-lg bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 transition-colors"
          >
            Go to Dashboard
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  // Landing page for non-authenticated users
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Purple gradient with features */}
      <div className="flex-1 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-12 text-white">
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="mb-12">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-xl font-bold">Enterprise Platform</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <h1 className="mb-6 text-4xl font-bold leading-tight">
              Build intelligent<br />
              knowledge pipelines<br />
              at enterprise scale
            </h1>
            <p className="mb-12 text-lg text-purple-100 leading-relaxed">
              Transform your documents into a powerful AI knowledge base
              with advanced RAG pipelines, real-time observability, and
              seamless deployment.
            </p>

            {/* Features */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Multi-Source Ingestion</h3>
                  <p className="text-sm text-purple-200">
                    Ingest AWS S3, Azure Blob, GCP Storage, FTP, and local
                    sources seamlessly.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Advanced RAG Pipelines</h3>
                  <p className="text-sm text-purple-200">
                    Configure chunking strategies, embedding models, and vector
                    databases for optimal retrieval.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Real-time Observability</h3>
                  <p className="text-sm text-purple-200">
                    Monitor pipeline health, latency metrics, and trace every
                    document processing operation.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Project Deployment</h3>
                  <p className="text-sm text-purple-200">
                    Deploy knowledge bases as API endpoints with generated
                    credentials and access management.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center space-x-6 text-sm text-purple-200">
            <span>SOC 2 TYPE II</span>
            <span>GDPR READY</span>
            <span>ISO 27001</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login */}
      <div className="flex w-96 items-center justify-center bg-white p-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600">Sign in to your workspace to continue</p>
          </div>

          <form
            action={async () => {
              "use server";
              await signIn("keycloak", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center rounded-lg bg-purple-600 px-6 py-3 text-white font-semibold hover:bg-purple-700 transition-colors"
            >
              Sign in
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              DEMO CREDENTIALS<br />
              <span className="font-mono">admin@test.ai</span><br />
              <span className="text-blue-600 hover:underline cursor-pointer">Use Demo →</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
