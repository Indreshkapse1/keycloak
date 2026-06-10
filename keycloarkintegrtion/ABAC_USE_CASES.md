# ABAC Use Cases and Examples

## 🎯 Use Case 1: Admin Full Access

### **Scenario**
Admin user has complete control over all features.

### **User**
- **Username:** ram
- **Role:** admin
- **Permissions:** View, Create, Edit, Delete (all resources)

### **Implementation**
```typescript
import { isAdmin, getProjectActions, getResourceActions } from "@/lib/abac";

if (isAdmin(session)) {
  // Show all admin features
  const projectActions = getProjectActions(session);
  const resourceActions = getResourceActions(session);
  
  // projectActions = ["view", "create", "edit", "delete"]
  // resourceActions = ["view", "create", "edit", "delete"]
}
```

### **Test Cases**
```
User: ram (Admin)
- View Projects: ✅
- Create Project: ✅
- Edit Project: ✅
- Delete Project: ✅
- View Resources: ✅
- Create Resource: ✅
- Edit Resource: ✅
- Delete Resource: ✅
```

---

## 🎯 Use Case 2: Project Manager - Project Management Only

### **Scenario**
Project manager can manage projects but cannot access resources or delete.

### **User**
- **Username:** alice
- **Role:** projectmanager
- **Permissions:** View, Create, Edit projects only

### **Implementation**
```typescript
import { isProjectManager, getProjectActions, getResourceActions } from "@/lib/abac";

if (isProjectManager(session)) {
  const projectActions = getProjectActions(session);
  // projectActions = ["view", "create", "edit"]
  
  const resourceActions = getResourceActions(session);
  // resourceActions = [] (empty)
  
  // Show project management UI
  // Hide resource management UI
}
```

### **Test Cases**
```
User: alice (ProjectManager)
- View Projects: ✅
- Create Project: ✅
- Edit Project: ✅
- Delete Project: ❌
- View Resources: ❌
- Create Resource: ❌
- Edit Resource: ❌
- Delete Resource: ❌
```

---

## 🎯 Use Case 3: Lead - Resource Management Only

### **Scenario**
Lead can manage resources but cannot access projects or delete.

### **User**
- **Username:** bob
- **Role:** lead
- **Permissions:** View, Create, Edit resources only

### **Implementation**
```typescript
import { isLead, getProjectActions, getResourceActions } from "@/lib/abac";

if (isLead(session)) {
  const projectActions = getProjectActions(session);
  // projectActions = [] (empty)
  
  const resourceActions = getResourceActions(session);
  // resourceActions = ["view", "create", "edit"]
  
  // Show resource management UI
  // Hide project management UI
}
```

### **Test Cases**
```
User: bob (Lead)
- View Projects: ❌
- Create Project: ❌
- Edit Project: ❌
- Delete Project: ❌
- View Resources: ✅
- Create Resource: ✅
- Edit Resource: ✅
- Delete Resource: ❌
```

---

## 🎯 Use Case 4: Conditional UI Rendering

### **Scenario**
Show/hide UI elements based on user role.

### **Implementation**
```typescript
"use client";

import { useSession } from "next-auth/react";
import { isAdmin, isProjectManager, isLead } from "@/lib/abac";
import { SessionWithRoles } from "@/types/auth";

export function Dashboard() {
  const { data: session } = useSession();
  const sessionWithRoles = session as SessionWithRoles;

  return (
    <div>
      {/* Show to all authenticated users */}
      <h1>Dashboard</h1>

      {/* Show only to admins */}
      {isAdmin(sessionWithRoles) && (
        <section>
          <h2>Admin Panel</h2>
          <button>Manage Users</button>
          <button>View Logs</button>
        </section>
      )}

      {/* Show only to project managers */}
      {isProjectManager(sessionWithRoles) && (
        <section>
          <h2>Project Management</h2>
          <button>Create Project</button>
          <button>View All Projects</button>
        </section>
      )}

      {/* Show only to leads */}
      {isLead(sessionWithRoles) && (
        <section>
          <h2>Resource Management</h2>
          <button>Create Resource</button>
          <button>View All Resources</button>
        </section>
      )}
    </div>
  );
}
```

---

## 🎯 Use Case 5: API Route Protection

### **Scenario**
Protect API endpoints based on user role.

### **Implementation**
```typescript
import { auth } from "@/auth";
import { isAdmin, isProjectManager } from "@/lib/abac";
import { SessionWithRoles } from "@/types/auth";
import { NextResponse } from "next/server";

// GET /api/projects
export async function GET(request: Request) {
  const session = (await auth()) as SessionWithRoles | null;

  // Only admins and project managers can view projects
  if (!isAdmin(session) && !isProjectManager(session)) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  // Return projects
  return NextResponse.json({
    projects: [
      { id: "1", name: "Project Alpha" },
      { id: "2", name: "Project Beta" },
    ],
  });
}

// POST /api/projects
export async function POST(request: Request) {
  const session = (await auth()) as SessionWithRoles | null;

  // Only admins and project managers can create projects
  if (!isAdmin(session) && !isProjectManager(session)) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const body = await request.json();

  // Create project
  return NextResponse.json({
    success: true,
    project: { id: "3", name: body.name },
  });
}

// DELETE /api/projects/:id
export async function DELETE(request: Request) {
  const session = (await auth()) as SessionWithRoles | null;

  // Only admins can delete projects
  if (!isAdmin(session)) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  // Delete project
  return NextResponse.json({
    success: true,
    message: "Project deleted",
  });
}
```

---

## 🎯 Use Case 6: Action-Based Permission Check

### **Scenario**
Check if user can perform a specific action before executing it.

### **Implementation**
```typescript
import { canPerformAction } from "@/lib/abac";
import { SessionWithRoles } from "@/types/auth";

async function deleteProject(session: SessionWithRoles | null, projectId: string) {
  // Check permission
  const decision = canPerformAction(session, "delete", "project");

  if (!decision.allowed) {
    throw new Error(decision.reason);
    // "Role 'projectmanager' cannot delete project"
  }

  // Delete project
  console.log(`Deleting project ${projectId}`);
}

async function editResource(session: SessionWithRoles | null, resourceId: string) {
  // Check permission
  const decision = canPerformAction(session, "edit", "resource");

  if (!decision.allowed) {
    throw new Error(decision.reason);
    // "Role 'projectmanager' cannot edit resource"
  }

  // Edit resource
  console.log(`Editing resource ${resourceId}`);
}
```

---

## 🎯 Use Case 7: Dynamic Button Rendering

### **Scenario**
Show/hide action buttons based on user permissions.

### **Implementation**
```typescript
"use client";

import { useSession } from "next-auth/react";
import { getProjectActions, getResourceActions } from "@/lib/abac";
import { SessionWithRoles } from "@/types/auth";

interface ProjectCardProps {
  project: { id: string; name: string };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { data: session } = useSession();
  const actions = getProjectActions(session as SessionWithRoles);

  return (
    <div className="border p-4 rounded">
      <h3>{project.name}</h3>

      <div className="flex gap-2 mt-4">
        {actions.includes("view") && (
          <button className="px-3 py-1 bg-blue-500 text-white rounded">
            View
          </button>
        )}

        {actions.includes("create") && (
          <button className="px-3 py-1 bg-green-500 text-white rounded">
            Create
          </button>
        )}

        {actions.includes("edit") && (
          <button className="px-3 py-1 bg-yellow-500 text-white rounded">
            Edit
          </button>
        )}

        {actions.includes("delete") && (
          <button className="px-3 py-1 bg-red-500 text-white rounded">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
```

---

## 🎯 Use Case 8: Server-Side Page Protection

### **Scenario**
Protect entire pages based on user role.

### **Implementation**
```typescript
import { auth } from "@/auth";
import { isAdmin } from "@/lib/abac";
import { SessionWithRoles } from "@/types/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = (await auth()) as SessionWithRoles | null;

  // Redirect if not admin
  if (!isAdmin(session)) {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Only admins can see this page</p>
    </div>
  );
}
```

---

## 📊 Summary of Use Cases

| Use Case | Primary Benefit | Complexity |
|----------|-----------------|-----------|
| Admin Full Access | Complete control | Low |
| Project Manager | Project management | Low |
| Lead | Resource management | Low |
| Conditional UI | User experience | Medium |
| API Protection | Security | Medium |
| Action Checking | Permission validation | Medium |
| Dynamic Buttons | User experience | Medium |
| Page Protection | Security | Medium |

---

## 🚀 Implementation Tips

1. **Start Simple:** Begin with role checking
2. **Add UI Logic:** Then add conditional rendering
3. **Protect APIs:** Then protect API endpoints
4. **Monitor Access:** Log all access decisions
5. **Test Thoroughly:** Test all scenarios

---

## 💡 Best Practices

✅ **Check on Every Request:** Always verify permissions
✅ **Use Consistent Checks:** Use same functions everywhere
✅ **Log Access Decisions:** Track who did what
✅ **Fail Secure:** Deny by default
✅ **Test All Roles:** Test with each role
✅ **Document Rules:** Keep rules documented
✅ **Review Regularly:** Audit access patterns

---

## 🔗 Related Files

- `lib/abac.ts` - Core implementation
- `app/abac/page.tsx` - Testing UI
- `app/api/abac/check/route.ts` - API endpoints
- `ABAC_IMPLEMENTATION.md` - Complete guide
- `ABAC_QUICK_START.md` - Setup guide

---

## ✨ Conclusion

ABAC with user attributes provides:
- ✅ Simple role-based access control
- ✅ Easy to understand and maintain
- ✅ Real-time permission evaluation
- ✅ Support for complex scenarios
- ✅ Flexible and extensible

Choose the use case that matches your needs and extend from there! 🚀
