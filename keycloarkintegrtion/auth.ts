import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Use environment variables or defaults for development
const nextAuthSecret = process.env.NEXTAUTH_SECRET || "dev-secret-key-change-in-production-12345678";
const nextAuthUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

// Require proper values in production
if (process.env.NODE_ENV === "production") {
  if (!process.env.NEXTAUTH_SECRET) {
    throw new Error("NEXTAUTH_SECRET environment variable must be set in production");
  }
  if (!process.env.NEXTAUTH_URL) {
    throw new Error("NEXTAUTH_URL environment variable must be set in production");
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: nextAuthSecret,
});
