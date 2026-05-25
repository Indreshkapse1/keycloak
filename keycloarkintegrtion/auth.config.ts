import type { NextAuthConfig } from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

// Helper function to decode JWT token
function decodeJWT(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, "base64")
        .toString()
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("[AUTH] Error decoding JWT:", error);
    return null;
  }
}

export const authConfig = {
  providers: [
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      console.log("[AUTH] JWT Callback triggered");
      if (account && profile) {
        console.log("[AUTH] New authentication - Account data:", account);
        console.log("[AUTH] User profile from Keycloak:", profile);
        console.log("[AUTH] Access token:", account.access_token);

        // Decode access token to extract roles
        const decodedToken = decodeJWT(account.access_token as string);
        console.log("[AUTH] Decoded access token:", decodedToken);

        // Extract realm roles
        const realmRoles = decodedToken?.realm_access?.roles || [];
        console.log("[AUTH] Realm roles found:", realmRoles);

        // Extract resource/client roles
        const resourceAccess = decodedToken?.resource_access || {};
        console.log("[AUTH] Resource access found:", resourceAccess);

        // Build grouped roles structure
        const groupedRoles: Record<string, string[]> = {
          realm: realmRoles,
        };

        // Add each client's roles
        Object.keys(resourceAccess).forEach((clientId) => {
          const clientRoles = resourceAccess[clientId]?.roles || [];
          if (clientRoles.length > 0) {
            groupedRoles[clientId] = clientRoles;
          }
        });

        console.log("[AUTH] Grouped roles structure:", groupedRoles);

        token.accessToken = account.access_token;
        token.email = profile.email;
        token.name = profile.name || profile.preferred_username;
        token.roles = groupedRoles;
      } else {
        console.log("[AUTH] Existing token being refreshed");
      }
      console.log("[AUTH] Final JWT token:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("[AUTH] Session Callback triggered");
      console.log("[AUTH] Token received:", token);
      if (token) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        (session.user as any).roles = token.roles || [];
        (session as any).accessToken = token.accessToken;
      }
      console.log("[AUTH] Final session object:", session);
      console.log("[AUTH] User roles in session:", (session.user as any).roles);
      return session;
    },
  },
} satisfies NextAuthConfig;
