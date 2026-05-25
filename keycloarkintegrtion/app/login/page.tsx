import { signIn } from "@/auth";

export default function LoginPage() {
  console.log("[AUTH SERVER] Login page rendered");
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-purple-100 p-4">
            <svg className="h-12 w-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to your account using Keycloak
          </p>
        </div>

        <form
          action={async () => {
            "use server";
            console.log("[AUTH SERVER] Sign in action triggered");
            console.log("[AUTH SERVER] Calling signIn with provider: keycloak");
            await signIn("keycloak", { redirectTo: "/dashboard" });
            console.log("[AUTH SERVER] signIn call completed");
          }}
          className="mt-8"
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center rounded-lg bg-purple-600 px-6 py-4 text-white font-semibold hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Continue with Keycloak
          </button>
        </form>

        <div className="text-center text-xs text-gray-500">
          Protected by Keycloak Authentication
        </div>
      </div>
    </div>
  );
}
