# Keycloak Roles - Quick Reference

## ✅ What's Been Implemented

### 📁 Core Files
- `types/auth.ts` - Type definitions for roles
- `lib/roles.ts` - Role checking utilities (RoleChecker class)
- `lib/auth-middleware.ts` - Server-side protection middleware
- `components/RoleGuard.tsx` - Client-side role guards

### 🎯 Example Pages
- `/admin` - Admin-only page
- `/manager` - Manager-only page
- `/client-admin` - Client role example
- `/api-example` - API testing page
- `/api/protected` - Protected API endpoint

### 📊 Dashboard Updates
- Shows all assigned roles (realm + client)
- Dynamic navigation based on user roles
- Role-specific page links

---

## 🚀 Quick Start

### 1. Server-Side Page Protection

```typescript
import { requireAdmin } from "@/lib/auth-middleware";

export default async function AdminPage() {
  const { session, response } = await requireAdmin();
  if (response) return response;
  
  return <div>Admin content</div>;
}
```

### 2. Check Roles in Components

```typescript
import { checkRoles } from "@/lib/roles";
import { SessionWithRoles } from "@/types/auth";

const session = (await auth()) as SessionWithRoles | null;
const roleChecker = checkRoles(session);

if (roleChecker.hasRealmRole("admin")) {
  // Show admin content
}
```

### 3. Client-Side Guards

```typescript
import { AdminGuard } from "@/components/RoleGuard";

<AdminGuard fallback={<p>Access denied</p>}>
  <button>Admin Action</button>
</AdminGuard>
```

### 4. API Protection

```typescript
import { requireRoles } from "@/lib/auth-middleware";

export async function GET() {
  const { session, response } = await requireRoles({
    realmRoles: ["user", "admin"],
  });
  if (response) return response;
  
  return NextResponse.json({ success: true });
}
```

---

## 📋 Available Functions

### Middleware (Server-Side)
- `requireAuth()` - Require authentication
- `requireAdmin()` - Require admin role
- `requireRealmRole(role)` - Require specific realm role
- `requireClientRole(clientId, role)` - Require client role
- `requireRoles({ realmRoles, clientRoles, requireAll })` - Custom requirements

### RoleChecker Methods
- `hasRealmRole(role)` - Check single realm role
- `hasClientRole(clientId, role)` - Check single client role
- `hasAnyRealmRole([roles])` - Check any of multiple realm roles
- `hasAllRealmRoles([roles])` - Check all realm roles required
- `isAdmin()` - Check if user is admin
- `isUser()` - Check if user has user role

### React Components
- `<AdminGuard>` - Show only to admins
- `<RealmRoleGuard role="...">` - Show for specific realm role
- `<ClientRoleGuard clientId="..." role="...">` - Show for client role
- `<RoleGuard>` - Custom role requirements

---

## 🔧 Setup Roles in Keycloak

### Realm Roles
1. Keycloak Admin → **Roles** → **Create Role**
2. Add: `admin`, `manager`, `user`, etc.
3. Assign to users: **Users** → Select User → **Role Mapping**

### Client Roles
1. **Clients** → Select client → **Roles** → **Create Role**
2. Add: `client-admin`, `client-user`, etc.
3. Assign: **Users** → Select User → **Role Mapping** → **Client Roles**

---

## 🧪 Testing

1. **Create test users** with different roles in Keycloak
2. **Login** and check the dashboard
3. **Try accessing** protected pages:
   - `/admin` (needs admin role)
   - `/manager` (needs manager role)
   - `/client-admin` (needs myclient/client-admin role)
4. **Test API** at `/api-example`

---

## 📖 Full Documentation

See `ROLES_GUIDE.md` for comprehensive documentation including:
- Detailed API reference
- Security best practices
- Common patterns
- Troubleshooting guide
- Advanced examples

---

## ⚠️ Security Reminders

1. ✅ Always use server-side protection for sensitive resources
2. ✅ Client-side guards are for UX only, not security
3. ✅ Validate roles on every request
4. ✅ Use HTTPS in production
5. ✅ Follow principle of least privilege

---

## 🎯 Common Use Cases

### Admin or Manager Access
```typescript
await requireRoles({
  realmRoles: ["admin", "manager"],
  requireAll: false
});
```

### Multiple Required Roles
```typescript
await requireRoles({
  realmRoles: ["admin", "superuser"],
  requireAll: true
});
```

### Conditional Rendering
```typescript
{roleChecker.isAdmin() && <AdminPanel />}
{roleChecker.hasRealmRole("manager") && <ManagerTools />}
```

---

## 📞 Need Help?

- Check `ROLES_GUIDE.md` for detailed documentation
- Review example pages in `/app/admin`, `/app/manager`, etc.
- Test with `/api-example` page
- Check Keycloak console logs for debugging
