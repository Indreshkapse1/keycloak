# Attribute-Based Access Control (ABAC) Implementation

## 🎯 Overview

This implementation uses **User Attributes** to enforce **Attribute-Based Access Control (ABAC)** where access is determined by user's role attribute.

---

## 👥 Users and Their Roles

| User | Role | Access Level | Description |
|------|------|--------------|-------------|
| **ram** | `admin` | Full Access | Administrator with complete control |
| **alice** | `projectmanager` | Project Manager | Can manage all projects |
| **bob** | `lead` | Lead | Can manage all resources |

---

## 🔐 Access Control Rules

### **1. Admin (ram)**
- **Role:** `admin`
- **Projects:** View ✅ | Create ✅ | Edit ✅ | Delete ✅
- **Resources:** View ✅ | Create ✅ | Edit ✅ | Delete ✅
- **Use Case:** Full administrative access to all features

### **2. ProjectManager (alice)**
- **Role:** `projectmanager`
- **Projects:** View ✅ | Create ✅ | Edit ✅ | Delete ❌
- **Resources:** View ❌ | Create ❌ | Edit ❌ | Delete ❌
- **Use Case:** Can manage projects but cannot delete or access resources

### **3. Lead (bob)**
- **Role:** `lead`
- **Projects:** View ❌ | Create ❌ | Edit ❌ | Delete ❌
- **Resources:** View ✅ | Create ✅ | Edit ✅ | Delete ❌
- **Use Case:** Can manage resources but cannot delete or access projects

---

## 📁 Files Created

### **Core ABAC Library**
```
lib/abac.ts
├── extractUserAttributes() - Extract role from session
├── hasRole() - Check if user has specific role
├── isAdmin() - Check if user is admin
├── isProjectManager() - Check if user is project manager
├── isLead() - Check if user is lead
├── getUserAccessLevel() - Get user's access level
├── canViewProjects() - Check project view permission
├── canCreateProject() - Check project create permission
├── canEditProject() - Check project edit permission
├── canDeleteProject() - Check project delete permission
├── canViewResources() - Check resource view permission
├── canCreateResource() - Check resource create permission
├── canEditResource() - Check resource edit permission
├── canDeleteResource() - Check resource delete permission
├── getProjectActions() - Get available project actions
├── getResourceActions() - Get available resource actions
└── canPerformAction() - Check if action is allowed
```

### **UI Pages**
```
app/abac/page.tsx
├── User profile display
├── Role indicators
├── Projects section with available actions
├── Resources section with available actions
└── Access rules documentation
```

### **API Endpoints**
```
app/api/abac/check/route.ts
├── POST - Check if user can perform action
└── GET - Get user's attributes and permissions
```

---

## 🚀 How It Works

### **1. Extract User Attributes from Session**

```typescript
import { extractUserAttributes } from "@/lib/abac";

const attributes = extractUserAttributes(session);
// Returns:
// {
//   role: "admin" | "projectmanager" | "lead",
//   username: "ram",
//   email: "ram@example.com"
// }
```

### **2. Check User Role**

```typescript
import { isAdmin, isProjectManager, isLead } from "@/lib/abac";

if (isAdmin(session)) {
  // User is admin
}

if (isProjectManager(session)) {
  // User is project manager
}

if (isLead(session)) {
  // User is lead
}
```

### **3. Check Specific Permission**

```typescript
import { canViewProjects, canDeleteProject } from "@/lib/abac";

if (canViewProjects(session)) {
  // User can view projects
}

if (canDeleteProject(session)) {
  // User can delete projects
}
```

### **4. Get Available Actions**

```typescript
import { getProjectActions, getResourceActions } from "@/lib/abac";

const projectActions = getProjectActions(session);
// Returns: ["view", "create", "edit"] or ["view", "create", "edit", "delete"]

const resourceActions = getResourceActions(session);
// Returns: ["view", "create", "edit"] or ["view", "create", "edit", "delete"]
```

### **5. Check Action Permission**

```typescript
import { canPerformAction } from "@/lib/abac";

const decision = canPerformAction(session, "delete", "project");
// Returns:
// {
//   allowed: false,
//   reason: "Role 'projectmanager' cannot delete project"
// }
```

---

## 🧪 Testing Scenarios

### **Scenario 1: Admin (ram) Access**

**Setup:**
1. Login as `ram`
2. Go to `/abac`

**Expected Results:**
- ✅ Role: **admin**
- ✅ Access Level: **Admin**
- ✅ Admin Status: **Yes**
- ✅ ProjectManager Status: **No**
- ✅ Lead Status: **No**
- ✅ Projects: Can view, create, edit, delete
- ✅ Resources: Can view, create, edit, delete

**API Test:**
```bash
# Check project delete permission
curl -X POST http://localhost:3000/api/abac/check \
  -H "Content-Type: application/json" \
  -d '{"action":"delete","resourceType":"project"}'

# Expected: { "allowed": true }

# Get user permissions
curl -X GET http://localhost:3000/api/abac/check

# Expected: All permissions true
```

---

### **Scenario 2: ProjectManager (alice) Access**

**Setup:**
1. Login as `alice`
2. Go to `/abac`

**Expected Results:**
- ✅ Role: **projectmanager**
- ✅ Access Level: **ProjectManager**
- ✅ Admin Status: **No**
- ✅ ProjectManager Status: **Yes**
- ✅ Lead Status: **No**
- ✅ Projects: Can view, create, edit (NOT delete)
- ❌ Resources: Cannot access

**API Test:**
```bash
# Check project edit permission
curl -X POST http://localhost:3000/api/abac/check \
  -H "Content-Type: application/json" \
  -d '{"action":"edit","resourceType":"project"}'

# Expected: { "allowed": true }

# Check project delete permission
curl -X POST http://localhost:3000/api/abac/check \
  -H "Content-Type: application/json" \
  -d '{"action":"delete","resourceType":"project"}'

# Expected: { "allowed": false }

# Check resource access
curl -X POST http://localhost:3000/api/abac/check \
  -H "Content-Type: application/json" \
  -d '{"action":"view","resourceType":"resource"}'

# Expected: { "allowed": false }
```

---

### **Scenario 3: Lead (bob) Access**

**Setup:**
1. Login as `bob`
2. Go to `/abac`

**Expected Results:**
- ✅ Role: **lead**
- ✅ Access Level: **Lead**
- ✅ Admin Status: **No**
- ✅ ProjectManager Status: **No**
- ✅ Lead Status: **Yes**
- ❌ Projects: Cannot access
- ✅ Resources: Can view, create, edit (NOT delete)

**API Test:**
```bash
# Check resource edit permission
curl -X POST http://localhost:3000/api/abac/check \
  -H "Content-Type: application/json" \
  -d '{"action":"edit","resourceType":"resource"}'

# Expected: { "allowed": true }

# Check resource delete permission
curl -X POST http://localhost:3000/api/abac/check \
  -H "Content-Type: application/json" \
  -d '{"action":"delete","resourceType":"resource"}'

# Expected: { "allowed": false }

# Check project access
curl -X POST http://localhost:3000/api/abac/check \
  -H "Content-Type: application/json" \
  -d '{"action":"view","resourceType":"project"}'

# Expected: { "allowed": false }
```

---

## 🔧 Keycloak Configuration

### **Step 1: Create Users**

```
Keycloak Admin Console → Users → Add user

1. ram
   - Username: ram
   - Email: ram@example.com
   - Password: (set in Credentials)
   - Attributes: role = admin

2. alice
   - Username: alice
   - Email: alice@example.com
   - Password: (set in Credentials)
   - Attributes: role = projectmanager

3. bob
   - Username: bob
   - Email: bob@example.com
   - Password: (set in Credentials)
   - Attributes: role = lead
```

### **Step 2: Add Custom Attributes**

For each user:
1. Go to **Users** → Select user
2. Go to **Attributes** tab
3. Add attribute:
   - **Key:** `role`
   - **Value:** `admin` | `projectmanager` | `lead`
4. Click **Add** then **Save**

### **Step 3: Configure Token Mapper**

To include custom attributes in JWT token:

1. Go to **Clients** → **my-app** → **Client Scopes**
2. Click **"roles"** scope
3. Go to **Mappers** → **Add mapper** → **By configuration**
4. Select **"User Attribute"**
5. Configure:
   - **Name:** `role`
   - **User Attribute Name:** `role`
   - **Token Claim Name:** `role`
   - **Add to ID token:** `ON`
   - **Add to access token:** `ON`
6. Click **Save**

---

## 📝 Code Examples

### **Server-Side Protection**

```typescript
import { auth } from "@/auth";
import { isAdmin } from "@/lib/abac";
import { SessionWithRoles } from "@/types/auth";

export default async function AdminPage() {
  const session = (await auth()) as SessionWithRoles | null;

  if (!isAdmin(session)) {
    return <div>Access Denied</div>;
  }

  return <div>Admin Content</div>;
}
```

### **Client-Side Conditional Rendering**

```typescript
"use client";

import { useSession } from "next-auth/react";
import { getProjectActions } from "@/lib/abac";
import { SessionWithRoles } from "@/types/auth";

export function ProjectActions() {
  const { data: session } = useSession();
  const actions = getProjectActions(session as SessionWithRoles);

  return (
    <div className="flex gap-2">
      {actions.includes("view") && <button>View</button>}
      {actions.includes("create") && <button>Create</button>}
      {actions.includes("edit") && <button>Edit</button>}
      {actions.includes("delete") && <button>Delete</button>}
    </div>
  );
}
```

### **API Route Protection**

```typescript
import { auth } from "@/auth";
import { isProjectManager } from "@/lib/abac";
import { SessionWithRoles } from "@/types/auth";

export async function GET(request: Request) {
  const session = (await auth()) as SessionWithRoles | null;

  if (!isProjectManager(session)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  return Response.json({ projects: [...] });
}
```

---

## 🎯 Key Features

✅ **Attribute-Based Access Control** - Access determined by user attributes
✅ **Simple Role System** - Three roles: admin, projectmanager, lead
✅ **Resource-Specific Permissions** - Different permissions for projects vs resources
✅ **Action-Based Control** - View, Create, Edit, Delete permissions
✅ **Real-Time Evaluation** - Permissions checked on every request
✅ **Easy to Extend** - Add new roles and permissions easily
✅ **Type-Safe** - Full TypeScript support

---

## 📊 Access Matrix Summary

| User | Role | Projects | Resources | Full Access |
|------|------|----------|-----------|------------|
| **ram** | admin | ✅ All | ✅ All | ✅ Yes |
| **alice** | projectmanager | ✅ View, Create, Edit | ❌ None | ❌ No |
| **bob** | lead | ❌ None | ✅ View, Create, Edit | ❌ No |

---

## 🔗 Related Files

- `lib/abac.ts` - Core ABAC logic
- `app/abac/page.tsx` - Testing UI
- `app/api/abac/check/route.ts` - API endpoints
- `auth.config.ts` - Keycloak configuration
- `types/auth.ts` - Type definitions

---

## ✨ Summary

You now have a complete **Attribute-Based Access Control (ABAC)** system that:

✅ Uses user attributes for access control
✅ Supports three roles with different permissions
✅ Provides resource-specific access rules
✅ Controls actions per resource type
✅ Easy to test and extend
✅ Well-documented with examples

**Start by setting up Keycloak user attributes, then test the `/abac` page!** 🚀
