import { signOut } from "@/auth";

export async function handleLogout() {
  "use server";
  
  console.log("[AUTH SERVER] Logout initiated");
  
  // Build Keycloak logout URL
  const keycloakIssuer = "http://localhost:8081/realms/myrealm";
  const logoutUrl = `${keycloakIssuer}/protocol/openid-connect/logout`;
  
  // Redirect URL after Keycloak logout completes
  const postLogoutRedirectUri = "http://localhost:3000/";
  
  // Build full logout URL with redirect
  const keycloakLogoutUrl = `${logoutUrl}?post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}`;
  
  console.log("[AUTH SERVER] Keycloak logout URL:", keycloakLogoutUrl);
  
  // Sign out from NextAuth and redirect to Keycloak logout
  await signOut({ redirect: true, redirectTo: keycloakLogoutUrl });
}
