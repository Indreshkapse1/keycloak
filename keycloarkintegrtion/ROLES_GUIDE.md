# Keycloak Role-Based Access Control (RBAC) Guide

## Overview

This application implements comprehensive role-based access control using Keycloak roles. Both **realm roles** and **client roles** are supported.

## Files Created

### 1. Type Definitions
- **`types/auth.ts`** - TypeScript interfaces for roles and sessions

### 2. Utility Functions
- **`lib/roles.ts`** - Role checking utilities and RoleChecker class
- **`lib/auth-middleware.ts`** - Server-side middleware for protecting routes and APIs

### 3. React Components
- **`components/RoleGuard.tsx`** - Client-side role protection components

### 4. Example Pages
- **`app/admin/page.tsx`** - Admin-only page (requires "admin" realm role)
- **`app/manager/page.tsx`** - Manager page (requires "manager" realm role)
- **`app/client-admin/page.tsx`** - Client-specific page (requires "client-admin" role for "myclient")
- **`app/api-example/page.tsx`** - API testing page

### 5. API Routes
- **`app/api/protected/route.ts`** - Role-protected API endpoint example

---

## How to Use Roles

### 1. Server-Side Page Protection

Protect entire pages using middleware functions:

```typescript
import { requireAdmin, requireRoles, requireRealmRole, requireClientRole } from "@/lib/auth-middleware";

// Require admin role
export default async function AdminPage() {
  const { session, response } = await requireAdmin();
  if (response) return response;
  
  // Your page content
  return <div>Admin content</div>;
}

// Require specific realm role
export default async function ManagerPage() {
  const { session, response } = await requireRealmRole("manager");
  if (response) return response;
  
  return <div>Manager content</div>;
}

// Require client role
export default async function ClientPage() {
  const { session, response } = await requireClientRole("myclient", "client-admin");
  if (response) return response;
  
  return <div>Client admin content</div>;
}

// Require any of multiple roles
export default async function FlexiblePage() {
  const { session, response } = await requireRoles({
    realmRoles: ["admin", "manager"],
    clientRoles: { "myclient": ["client-admin"] },
    requireAll: false // true = must have ALL roles, false = must have ANY role
  });
  if (response) return response;
  
  return <div>Content</div>;
}
```

### 2. API Route Protection

Protect API endpoints:

```typescript
import { requireRoles } from "@/lib/auth-middleware";
import { NextResponse } from "next/server";

export async function GET() {
  const { session, response } = await requireRoles({
    realmRoles: ["user", "admin"],
  });

  if (response) return response;

  return NextResponse.json({
    message: "Success!",
    user: session?.user,
  });
}
```

### 3. Client-Side Role Checks

Use the RoleChecker utility in server components:

```typescript
import { auth } from "@/auth";
import { SessionWithRoles } from "@/types/auth";
import { checkRoles } from "@/lib/roles";

export default async function MyPage() {
  const session = (await auth()) as SessionWithRoles | null;
  const roleChecker = checkRoles(session);

  // Check single realm role
  if (roleChecker.hasRealmRole("admin")) {
    // Show admin content
  }

  // Check client role
  if (roleChecker.hasClientRole("myclient", "client-admin")) {
    // Show client admin content
  }

  // Check if user is admin
  if (roleChecker.isAdmin()) {
    // Admin-specific content
  }

  // Check multiple roles (ANY)
  if (roleChecker.hasAnyRealmRole(["admin", "manager"])) {
    // Content for admin OR manager
  }

  // Check multiple roles (ALL)
  if (roleChecker.hasAllRealmRoles(["admin", "superuser"])) {
    // Content for users with BOTH roles
  }

  // Get all roles
  const allRoles = roleChecker.getAllRoles();
  const realmRoles = roleChecker.getAllRealmRoles();
  const clientRoles = roleChecker.getClientRoles("myclient");
}
```

### 4. Client-Side React Components

Use RoleGuard components for conditional rendering:

```typescript
"use client";

import { RoleGuard, RealmRoleGuard, ClientRoleGuard, AdminGuard } from "@/components/RoleGuard";

export default function MyComponent() {
  return (
    <div>
      {/* Show only to admins */}
      <AdminGuard fallback={<p>Access denied</p>}>
        <button>Admin Action</button>
      </AdminGuard>

      {/* Show only to users with specific realm role */}
      <RealmRoleGuard role="manager" fallback={<p>Managers only</p>}>
        <div>Manager content</div>
      </RealmRoleGuard>

      {/* Show only to users with specific client role */}
      <ClientRoleGuard clientId="myclient" role="client-admin">
        <div>Client admin content</div>
      </ClientRoleGuard>

      {/* Custom role requirements */}
      <RoleGuard
        realmRoles={["admin", "manager"]}
        clientRoles={{ "myclient": ["client-admin"] }}
        requireAll={false}
        fallback={<p>Insufficient permissions</p>}
      >
        <div>Protected content</div>
      </RoleGuard>
    </div>
  );
}
```

---

## Role Checker API Reference

### RoleChecker Class Methods

```typescript
const roleChecker = checkRoles(session);

// Realm role checks
roleChecker.hasRealmRole(role: string): boolean
roleChecker.hasAnyRealmRole(roles: string[]): boolean
roleChecker.hasAllRealmRoles(roles: string[]): boolean
roleChecker.getAllRealmRoles(): string[]

// Client role checks
roleChecker.hasClientRole(clientId: string, role: string): boolean
roleChecker.hasAnyClientRole(clientId: string, roles: string[]): boolean
roleChecker.hasAllClientRoles(clientId: string, roles: string[]): boolean
roleChecker.getClientRoles(clientId: string): string[]

// Combined checks
roleChecker.hasAnyRole(realmRoles?: string[], clientRoles?: Record<string, string[]>): boolean
roleChecker.getAllRoles(): UserRoles

// Convenience methods
roleChecker.isAdmin(): boolean  // Checks for "admin" or "administrator" realm role
roleChecker.isUser(): boolean   // Checks for "user" realm role
```

### Standalone Functions

```typescript
import { hasRealmRole, hasClientRole, hasAnyRealmRole, hasAllRealmRoles, isAdmin, isUser } from "@/lib/roles";

// Quick checks without creating RoleChecker instance
hasRealmRole(session, "admin")
hasClientRole(session, "myclient", "client-admin")
hasAnyRealmRole(session, ["admin", "manager"])
hasAllRealmRoles(session, ["admin", "superuser"])
isAdmin(session)
isUser(session)
```

---

## Setting Up Roles in Keycloak

### Realm Roles

1. Go to Keycloak Admin Console
2. Navigate to **Realm Settings** → **Roles**
3. Click **Create Role**
4. Add roles like: `admin`, `manager`, `user`, etc.
5. Assign roles to users in **Users** → Select User → **Role Mapping**

### Client Roles

1. Go to **Clients** → Select your client (e.g., "myclient")
2. Go to **Roles** tab
3. Click **Create Role**
4. Add client-specific roles like: `client-admin`, `client-user`, etc.
5. Assign to users in **Users** → Select User → **Role Mapping** → **Client Roles**

---

## Testing Role Protection

### Test Pages Available:

1. **`/admin`** - Requires "admin" or "administrator" realm role
2. **`/manager`** - Requires "manager" realm role
3. **`/client-admin`** - Requires "client-admin" role for "myclient" client
4. **`/api-example`** - Test role-protected API endpoint
5. **`/api/protected`** - API endpoint requiring user/admin/manager role

### Testing Steps:

1. **Create test users in Keycloak** with different role combinations
2. **Login with each user** and try accessing different pages
3. **Check the dashboard** - it shows which pages you can access based on your roles
4. **Try the API example** page to test API role protection

---

## Role Structure in Session

Roles are stored in the session as:

```typescript
{
  user: {
    name: "John Doe",
    email: "john@example.com",
    roles: {
      realm: ["admin", "user"],           // Realm roles
      myclient: ["client-admin"],         // Client roles for "myclient"
      anotherclient: ["viewer", "editor"] // Client roles for "anotherclient"
    }
  }
}
```

---

## Best Practices

1. **Use server-side protection** for sensitive pages and APIs
2. **Use client-side guards** for UI/UX improvements only (not security)
3. **Always validate roles on the server** - never trust client-side checks
4. **Use specific role names** - avoid generic names like "role1", "role2"
5. **Document role requirements** for each protected resource
6. **Test with different role combinations** to ensure proper access control
7. **Use `requireAll: true`** when multiple roles are mandatory
8. **Use `requireAll: false`** when any of the roles grants access

---

## Common Patterns

### Pattern 1: Admin or Manager Access

```typescript
const { session, response } = await requireRoles({
  realmRoles: ["admin", "manager"],
  requireAll: false // Either role grants access
});
```

### Pattern 2: Multiple Required Roles

```typescript
const { session, response } = await requireRoles({
  realmRoles: ["admin", "superuser"],
  requireAll: true // Must have BOTH roles
});
```

### Pattern 3: Realm + Client Role Combination

```typescript
const { session, response } = await requireRoles({
  realmRoles: ["user"],
  clientRoles: { "myclient": ["premium"] },
  requireAll: true // Must have realm role AND client role
});
```

### Pattern 4: Conditional UI Rendering

```typescript
const roleChecker = checkRoles(session);

return (
  <div>
    {roleChecker.isAdmin() && <AdminPanel />}
    {roleChecker.hasRealmRole("manager") && <ManagerTools />}
    {roleChecker.hasClientRole("myclient", "premium") && <PremiumFeatures />}
  </div>
);
```

---

## Troubleshooting

### Roles not showing in session?
- Check that roles are assigned to the user in Keycloak
- Verify the access token includes the roles (check browser console logs)
- Ensure the client scopes include "roles" scope

### Getting 403 Forbidden?
- Verify you have the required roles assigned
- Check the role names match exactly (case-sensitive)
- Look at server logs to see which roles are being checked

### Client roles not working?
- Ensure you're using the correct client ID
- Verify the client roles are assigned in Keycloak
- Check that the client ID in your code matches Keycloak

---

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never rely solely on client-side role checks** - they can be bypassed
2. **Always protect API routes** with server-side middleware
3. **Validate roles on every request** - don't cache role decisions
4. **Use HTTPS in production** to protect tokens
5. **Implement proper session management** and token refresh
6. **Log access attempts** for audit purposes
7. **Follow principle of least privilege** - grant minimum necessary roles

---

## Next Steps

1. **Create your own roles** in Keycloak based on your application needs
2. **Assign roles to test users** for testing
3. **Protect your pages and APIs** using the provided utilities
4. **Customize the RoleGuard components** for your UI needs
5. **Add logging and monitoring** for role-based access
6. **Implement role hierarchy** if needed (admin inherits manager, etc.)

For more information, refer to the [Keycloak Documentation](https://www.keycloak.org/docs/latest/server_admin/#_roles) on roles and RBAC.
