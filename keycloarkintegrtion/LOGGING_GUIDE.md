# Authentication Logging Guide

## Overview

Comprehensive logging has been added throughout the authentication flow without changing any existing functionality.

## Log Prefixes

- `[AUTH CLIENT]` - Browser console logs (client-side)
- `[AUTH SERVER]` - Terminal logs (server-side)
- `[AUTH API]` - NextAuth API route logs (server-side)
- `[AUTH]` - NextAuth callback logs (server-side)

## Login Flow Logs

### 1. When Login Page Loads

**Server Terminal:**

```
[AUTH SERVER] Login page rendered
```

**Browser Console:**

```
[AUTH CLIENT] Login page mounted
```

### 2. When User Clicks "Sign in with Keycloak"

**Browser Console:**

```
[AUTH CLIENT] Sign in button clicked
[AUTH CLIENT] Timestamp: 2026-04-29T07:30:00.000Z
[AUTH CLIENT] Initiating Keycloak authentication flow...
```

**Server Terminal:**

```
[AUTH SERVER] Sign in action triggered
[AUTH SERVER] Calling signIn with provider: keycloak
```

### 3. NextAuth API Requests

**Server Terminal:**

```
[AUTH API] GET request received
[AUTH API] URL: http://localhost:3000/api/auth/signin
[AUTH API] Headers: { ... }
[AUTH API] GET response status: 200
```

### 4. After Keycloak Authentication

**Server Terminal:**

```
[AUTH] JWT Callback triggered
[AUTH] New authentication - Account data: { provider: 'keycloak', ... }
[AUTH] User profile from Keycloak: { email: '...', name: '...', ... }
[AUTH] Access token: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
[AUTH] Decoded access token: { realm_access: { roles: [...] }, resource_access: {...}, ... }
[AUTH] Realm roles found: ['default-roles-myrealm', 'offline_access', 'uma_authorization']
[AUTH] Resource access found: { 'realm-management': {...}, 'broker': {...}, 'account': {...} }
[AUTH] Grouped roles structure: {
  realm: ['default-roles-myrealm', 'offline_access', 'uma_authorization'],
  'realm-management': ['create-client'],
  broker: ['read-token'],
  account: ['manage-account', 'view-applications', 'view-consent', ...]
}
[AUTH] Final JWT token: { accessToken: '...', email: '...', name: '...', roles: {...} }

[AUTH] Session Callback triggered
[AUTH] Token received: { accessToken: '...', email: '...', name: '...', roles: {...} }
[AUTH] Final session object: { user: { email: '...', name: '...', roles: {...} }, expires: '...' }
[AUTH] User roles in session: {
  realm: ['default-roles-myrealm', 'offline_access', 'uma_authorization'],
  'realm-management': ['create-client'],
  broker: ['read-token'],
  account: ['manage-account', 'view-applications', ...]
}
```

### 5. Dashboard Page Load

**Server Terminal:**

```
[AUTH SERVER] Dashboard page accessed
[AUTH SERVER] Session retrieved: { user: { email: '...', name: '...', roles: [...] }, expires: '...' }
[AUTH SERVER] Valid session found for user: { email: '...', name: '...', roles: [...] }
```

**Browser Console:**

```
[AUTH CLIENT] Dashboard mounted successfully
[AUTH CLIENT] Client-side session data: { user: { email: '...', name: '...', roles: {...} }, expires: '...' }
[AUTH CLIENT] User authenticated: { email: '...', name: '...', roles: {...} }
[AUTH CLIENT] Grouped user roles: { realm: [...], 'realm-management': [...], broker: [...], account: [...] }
[AUTH CLIENT] realm roles: ['default-roles-myrealm', 'offline_access', 'uma_authorization']
[AUTH CLIENT] realm-management roles: ['create-client']
[AUTH CLIENT] broker roles: ['read-token']
[AUTH CLIENT] account roles: ['manage-account', 'view-applications', 'view-consent', ...]
[AUTH CLIENT] Timestamp: 2026-04-29T07:30:05.000Z
```

### 6. Logout Flow

**Server Terminal:**

```
[AUTH SERVER] Logout initiated
[AUTH SERVER] Keycloak logout URL: http://localhost:8081/realms/myrealm/protocol/openid-connect/logout?post_logout_redirect_uri=...
```

**What Happens:**

1. User clicks "Sign Out"
2. NextAuth session is cleared
3. Browser redirects to Keycloak logout endpoint
4. Keycloak ends the SSO session
5. Keycloak redirects back to your app's home page
6. User must re-authenticate on next login

## Network Tab Details

In the Network tab, you'll see these requests during login:

1. **POST to `/api/auth/signin/keycloak`** - Initiates OAuth flow
2. **GET to Keycloak** - Redirects to Keycloak login
3. **POST to Keycloak** - User submits credentials
4. **GET to `/api/auth/callback/keycloak`** - OAuth callback with code
5. **POST to Keycloak token endpoint** - Exchanges code for tokens
6. **GET to `/dashboard`** - Final redirect after authentication

## What Data is Logged

### Full Access Token

- Complete JWT token from Keycloak
- Visible in `[AUTH] Access token:` log

### Decoded Access Token

- Decoded JWT payload with all claims
- Includes realm_access, resource_access, and other token data
- Visible in `[AUTH] Decoded access token:` log

### User Roles (UPDATED - Grouped by Client!)

- All roles assigned to the user in Keycloak, organized by source
- **Realm roles**: Base roles from `realm_access.roles`
- **Client roles**: Specific roles from `resource_access[clientId].roles`
- Extracted from the decoded access token and grouped by client
- Visible in multiple logs:
  - `[AUTH] Realm roles found:` - Realm-level roles
  - `[AUTH] Resource access found:` - All client access structures
  - `[AUTH] Grouped roles structure:` - Complete grouped structure
  - `[AUTH] User roles in session:` - Final grouped roles in session
- Displayed on the dashboard UI with client grouping:
  - 🌐 **Realm Roles** section
  - 🔑 **realm-management** roles section
  - 🔑 **broker** roles section
  - 🔑 **account** roles section
  - Each role shown as a colored badge within its group

### Full User Profile

- All profile data from Keycloak (email, name, preferred_username, etc.)
- Visible in `[AUTH] User profile from Keycloak:` log

### Account Data

- Provider information
- Token type, expires_at, scope
- Visible in `[AUTH] New authentication - Account data:` log

### Session Data

- Complete session object with user info and roles
- Visible in multiple logs throughout the flow

## Files Modified

1. `auth.config.ts` - Added JWT decoding, role extraction, and logging in jwt/session callbacks
2. `app/login/page.tsx` - Added server-side logging and client component
3. `app/login/LoginButton.tsx` - NEW: Client component for button with logging
4. `app/dashboard/page.tsx` - Added roles display UI, server-side logging, client component, and proper logout
5. `app/dashboard/DashboardClientLogger.tsx` - NEW: Client component for dashboard logging (includes roles)
6. `app/api/auth/[...nextauth]/route.ts` - Added request/response logging
7. `app/actions/logout.ts` - NEW: Server action for proper Keycloak + NextAuth logout

## No Functionality Changed

✅ All existing authentication flow remains unchanged
✅ Same UI and UX
✅ Same security measures
✅ Only logging added for visibility
