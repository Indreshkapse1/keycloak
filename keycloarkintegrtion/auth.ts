import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: "your-secret-key-change-this-in-production",
});
