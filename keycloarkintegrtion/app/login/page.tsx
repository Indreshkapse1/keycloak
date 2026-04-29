import { signIn } from "@/auth";
import LoginButton from "./LoginButton";

export default function LoginPage() {
  console.log("[AUTH SERVER] Login page rendered");
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-2xl dark:bg-gray-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
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
          className="mt-8 space-y-6"
        >
          <LoginButton />
        </form>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          Protected by Keycloak Authentication
        </div>
      </div>
    </div>
  );
}
