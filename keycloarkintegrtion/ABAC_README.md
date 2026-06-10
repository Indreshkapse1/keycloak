# Attribute-Based Access Control (ABAC) System

## 🎯 Overview

This is a complete **Attribute-Based Access Control (ABAC)** implementation using Keycloak custom user attributes. Access is determined by user roles stored as custom attributes in Keycloak.

---

## 👥 Users and Roles

| User | Role | Permissions |
|------|------|-------------|
| **ram** | `admin` | Full access to projects and resources |
| **alice** | `projectmanager` | Can manage projects (view, create, edit) |
| **bob** | `lead` | Can manage resources (view, create, edit) |

---

## 🚀 Quick Start (10 minutes)

### **1. Create Users in Keycloak**

For each user (ram, alice, bob):
1. Go to **Keycloak Admin Console** → **Users** → **Add user**
2. Set username and email
3. Go to **Credentials** → Set password
4. Go to **Attributes** → Add:
   - **Key:** `role`
   - **Value:** `admin` | `projectmanager` | `lead`

### **2. Configure Token Mapper**

1. Go to **Clients** → **my-app** → **Client Scopes**
2. Click **"roles"** scope → **Mappers** → **Add mapper**
3. Select **"User Attribute"**
4. Configure:
   - **Name:** `role`
   - **User Attribute Name:** `role`
   - **Token Claim Name:** `role`
   - **Add to ID token:** ON
   - **Add to access token:** ON
5. Click **Save**

### **3. Test**

1. Go to `/abac` page
2. Login as each user
3. Verify permissions

---

## 📁 Project Structure

```
lib/
├── abac.ts                    # Core ABAC logic
└── permissions.ts             # Permission checker

app/
├── abac/
│   └── page.tsx              # ABAC testing page
├── api/
│   └── abac/
│       └── check/
│           └── route.ts      # Permission API
└── dashboard/
    └── page.tsx              # Dashboard with ABAC link

Documentation/
├── ABAC_README.md            # This file
├── ABAC_QUICK_START.md       # 5-minute setup
├── ABAC_IMPLEMENTATION.md    # Complete guide
├── ABAC_USE_CASES.md         # 8 use case examples
├── ABAC_SUMMARY.md           # Overview
└── ABAC_CHECKLIST.md         # Step-by-step checklist
```

---

## 🔐 Access Control Rules

### **Admin (ram)**
```
Projects:   View ✅ | Create ✅ | Edit ✅ | Delete ✅
Resources:  View ✅ | Create ✅ | Edit ✅ | Delete ✅
```

### **ProjectManager (alice)**
```
Projects:   View ✅ | Create ✅ | Edit ✅ | Delete ❌
Resources:  View ❌ | Create ❌ | Edit ❌ | Delete ❌
```

### **Lead (bob)**
```
Projects:   View ❌ | Create ❌ | Edit ❌ | Delete ❌
Resources:  View ✅ | Create ✅ | Edit ✅ | Delete ❌
```

---

## 💻 Code Usage

### **Check User Role**

```typescript
import { isAdmin, isProjectManager, isLead } from "@/lib/abac";

if (isAdmin(session)) {
  // Show admin features
}
```

### **Get Available Actions**

```typescript
import { getProjectActions, getResourceActions } from "@/lib/abac";

const projectActions = getProjectActions(session);
const resourceActions = getResourceActions(session);
```

### **Check Specific Permission**

```typescript
import { canPerformAction } from "@/lib/abac";

const decision = canPerformAction(session, "delete", "project");
if (decision.allowed) {
  // Allow action
}
```

---

## 🧪 Testing

### **Test Admin (ram)**
- Login as `ram`
- Go to `/abac`
- Verify: Admin Status ✅, All actions available

### **Test ProjectManager (alice)**
- Login as `alice`
- Go to `/abac`
- Verify: ProjectManager Status ✅, Project actions available

### **Test Lead (bob)**
- Login as `bob`
- Go to `/abac`
- Verify: Lead Status ✅, Resource actions available

---

## 📚 Documentation

| Document | Purpose | Time |
|----------|---------|------|
| `ABAC_QUICK_START.md` | Setup guide | 5 min |
| `ABAC_IMPLEMENTATION.md` | Complete details | 20 min |
| `ABAC_USE_CASES.md` | 8 use case examples | 15 min |
| `ABAC_CHECKLIST.md` | Step-by-step checklist | 30 min |
| `ABAC_SUMMARY.md` | Overview | 5 min |

---

## 🔗 URLs

- **Dashboard:** `http://localhost:3000/dashboard`
- **ABAC Testing:** `http://localhost:3000/abac`
- **API Endpoint:** `POST /api/abac/check`

---

## 🎯 Key Features

✅ **Attribute-Based Access Control** - Access determined by user attributes
✅ **Simple Role System** - Three roles with clear permissions
✅ **Resource-Specific Permissions** - Different permissions for projects vs resources
✅ **Action-Based Control** - View, Create, Edit, Delete permissions
✅ **Real-Time Evaluation** - Permissions checked on every request
✅ **Easy to Extend** - Add new roles and permissions easily
✅ **Type-Safe** - Full TypeScript support

---

## 📊 Access Matrix

```
                Projects    Resources   Delete
Admin (ram)         ✅          ✅        ✅
ProjectManager      ✅          ❌        ❌
Lead (bob)          ❌          ✅        ❌
```

---

## 🚀 Next Steps

1. **Setup Keycloak** - Follow `ABAC_QUICK_START.md`
2. **Test Implementation** - Go to `/abac` page
3. **Review Use Cases** - See `ABAC_USE_CASES.md`
4. **Extend System** - Add more roles/permissions as needed
5. **Deploy** - Update environment variables and deploy

---

## 🔧 API Endpoints

### **Check Permission**

```bash
POST /api/abac/check
Content-Type: application/json

{
  "action": "delete",
  "resourceType": "project"
}

Response:
{
  "allowed": false,
  "reason": "Role 'projectmanager' cannot delete project"
}
```

### **Get User Permissions**

```bash
GET /api/abac/check

Response:
{
  "user": {
    "role": "admin",
    "username": "ram",
    "email": "ram@example.com"
  },
  "permissions": {
    "projects": {
      "view": true,
      "create": true,
      "edit": true,
      "delete": true
    },
    "resources": {
      "view": true,
      "create": true,
      "edit": true,
      "delete": true
    }
  }
}
```

---

## 📝 Configuration

### **Keycloak User Attributes**

Each user must have a `role` attribute:

```
User: ram
Attributes:
  - role: admin

User: alice
Attributes:
  - role: projectmanager

User: bob
Attributes:
  - role: lead
```

### **Token Mapper**

Configure "User Attribute" mapper in Keycloak:

```
Name: role
User Attribute Name: role
Token Claim Name: role
Add to ID token: ON
Add to access token: ON
```

---

## 🎓 Examples

### **Server-Side Protection**

```typescript
import { auth } from "@/auth";
import { isAdmin } from "@/lib/abac";

export default async function AdminPage() {
  const session = await auth();
  
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

export function ProjectCard() {
  const { data: session } = useSession();
  const actions = getProjectActions(session);
  
  return (
    <div>
      {actions.includes("delete") && <button>Delete</button>}
    </div>
  );
}
```

### **API Route Protection**

```typescript
import { auth } from "@/auth";
import { isProjectManager } from "@/lib/abac";

export async function GET() {
  const session = await auth();
  
  if (!isProjectManager(session)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  
  return Response.json({ projects: [...] });
}
```

---

## ✨ Summary

This ABAC system provides:

✅ Simple role-based access control
✅ Easy to understand and maintain
✅ Real-time permission evaluation
✅ Support for complex scenarios
✅ Flexible and extensible
✅ Well-documented with examples

**Get started with `ABAC_QUICK_START.md`!** 🚀

---

## 📞 Support

For detailed information, see:
- `ABAC_IMPLEMENTATION.md` - Complete implementation guide
- `ABAC_USE_CASES.md` - Real-world examples
- `ABAC_CHECKLIST.md` - Step-by-step setup
- `lib/abac.ts` - Source code

---

**Happy coding!** 🎉
