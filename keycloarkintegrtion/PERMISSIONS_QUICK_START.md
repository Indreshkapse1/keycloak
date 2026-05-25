# Resource Permissions - Quick Start

## ✅ What's Implemented

**Resource-based access control** where different users have different permissions on specific documents.

**Example Scenarios:**
- ✅ User A can view Document 1 but not Document 2
- ✅ User C can view and edit Document 1
- ✅ User D can only view Document 1

---

## 🚀 Quick Setup (5 Minutes)

### **1. Enable Authorization in Keycloak**

```
Keycloak Admin → Clients → myclient → Settings
✅ Client authentication: ON
✅ Authorization: ON
Click Save
```

### **2. Create Scopes**

```
Authorization → Scopes → Create scope

Create:
- view
- edit  
- delete
```

### **3. Create Resources**

```
Authorization → Resources → Create resource

Create:
- Name: document-1
- Type: document
- Scopes: view, edit, delete

Repeat for: document-2, document-3, document-4
```

### **4. Create Users**

```
Users → Add user

Create:
- usera (User A)
- userc (User C)
- userd (User D)

Set passwords for each
```

### **5. Create Policies**

```
Authorization → Policies → Create policy → User

Create:
- user-a-policy (select usera)
- user-c-policy (select userc)
- user-d-policy (select userd)
```

### **6. Create Permissions**

```
Authorization → Permissions → Create permission → Resource-based

User A - View Document 1:
- Resources: document-1
- Scopes: view
- Policy: user-a-policy

User C - View Document 1:
- Resources: document-1
- Scopes: view
- Policy: user-c-policy

User C - Edit Document 1:
- Resources: document-1
- Scopes: edit
- Policy: user-c-policy

User D - View Document 1:
- Resources: document-1
- Scopes: view
- Policy: user-d-policy
```

---

## 🧪 Test It

### **Test User A:**
```
1. Login as usera
2. Go to /documents
3. Should see: Document 1 (View only)
4. Should NOT see: Document 2
```

### **Test User C:**
```
1. Login as userc
2. Go to /documents
3. Should see: Document 1 (View + Edit buttons)
```

### **Test User D:**
```
1. Login as userd
2. Go to /documents
3. Should see: Document 1 (View only)
```

---

## 💻 Use in Code

### **Check Permission:**

```typescript
import { checkPermissions } from "@/lib/permissions";

const permissionChecker = checkPermissions(session);

// Check single permission
const canView = await permissionChecker.canView("document-1");
const canEdit = await permissionChecker.canEdit("document-1");
const canDelete = await permissionChecker.canDelete("document-1");

// Check multiple permissions
const perms = await permissionChecker.checkMultiplePermissions(
  "document-1",
  ["view", "edit", "delete"]
);
// Returns: { view: true, edit: false, delete: false }
```

### **Protect API:**

```typescript
import { requireResourcePermission } from "@/lib/permissions";

export async function GET(req, { params }) {
  const session = await auth();
  
  const result = await requireResourcePermission(
    session,
    params.id,
    "view"
  );
  
  if (!result.allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  // User has permission
  return NextResponse.json({ data: "..." });
}
```

---

## 📋 Permission Matrix

| User | Doc 1 | Doc 2 | Doc 3 | Doc 4 |
|------|-------|-------|-------|-------|
| User A | View | ❌ | ? | ? |
| User C | View, Edit | ? | ❌ | ? |
| User D | View | ? | ? | ❌ |

**You define the permissions!**

---

## 🎯 Key Files

- `lib/permissions.ts` - Permission checker
- `app/api/documents/route.ts` - List documents
- `app/api/documents/[id]/route.ts` - Single document
- `app/documents/page.tsx` - Document management UI
- `RESOURCE_PERMISSIONS_GUIDE.md` - Full documentation

---

## ⚡ Quick Commands

**View documents:**
```
http://localhost:3000/documents
```

**View specific document:**
```
http://localhost:3000/documents/document-1
```

**API endpoints:**
```
GET /api/documents - List accessible documents
GET /api/documents/[id] - Get single document
PUT /api/documents/[id] - Update document (needs edit permission)
DELETE /api/documents/[id] - Delete document (needs delete permission)
```

---

## 🔧 Configuration

**Client Secret:** Already configured in `auth.config.ts`
```
PX7OSn5NCZAPKZQI3ja4QAWYShzK52lu
```

**Keycloak URL:**
```
http://localhost:8080
```

**Realm:**
```
myrealm
```

**Client:**
```
myclient
```

---

## 📖 Full Documentation

See `RESOURCE_PERMISSIONS_GUIDE.md` for:
- Detailed setup instructions
- Advanced scenarios
- Troubleshooting
- Code examples
- Best practices

---

## ✨ What's Different from Role-Based?

**Role-Based (Before):**
```
User has "admin" role → Access ALL admin pages
```

**Resource-Based (Now):**
```
User A → Can view Document 1 only
User C → Can view AND edit Document 1
User D → Can view Document 1 only
```

**Much more granular control!** 🎯
