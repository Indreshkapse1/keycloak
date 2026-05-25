# Resource-Based Permissions Guide

## 🎯 Overview

This guide explains how to set up and use **resource-based permissions** with Keycloak Authorization Services. This allows you to control access to specific resources (documents, files, etc.) at a granular level.

---

## 📋 What's Implemented

### **Core Features:**
- ✅ Resource-based access control (RBAC)
- ✅ Attribute-based access control (ABAC)
- ✅ Per-resource permissions (view, edit, delete)
- ✅ Real-time permission checking with Keycloak
- ✅ Document management UI with permission-based actions

### **Files Created:**
- `types/permissions.ts` - Permission type definitions
- `lib/permissions.ts` - Permission checking utilities
- `lib/mock-documents.ts` - Mock document data
- `app/api/documents/route.ts` - List documents API
- `app/api/documents/[id]/route.ts` - Single document API
- `app/documents/page.tsx` - Document management UI
- `app/documents/[id]/page.tsx` - Document detail page

---

## 🔧 Keycloak Setup (Step-by-Step)

### **STEP 1: Enable Client Authentication & Authorization**

1. Go to **Keycloak Admin Console** → `http://localhost:8080`
2. Navigate to **Clients** → **myclient**
3. Go to **Settings** tab
4. **Enable these toggles:**
   - ✅ **Client authentication**: ON
   - ✅ **Authorization**: ON
5. Click **Save**

### **STEP 2: Get Client Secret**

1. Go to **Credentials** tab
2. Copy the **Client Secret**
3. Already added to `auth.config.ts`: `PX7OSn5NCZAPKZQI3ja4QAWYShzK52lu`

### **STEP 3: Create Scopes**

1. Go to **Authorization** → **Scopes** tab
2. Click **Create scope**

**Create these scopes:**

| Scope Name | Display Name | Description |
|------------|--------------|-------------|
| `view` | View | Permission to view resources |
| `edit` | Edit | Permission to edit resources |
| `delete` | Delete | Permission to delete resources |

### **STEP 4: Create Resources**

1. Go to **Authorization** → **Resources** tab
2. Click **Create resource**

**Create Document 1:**
- **Name**: `document-1`
- **Display name**: `Q1 Financial Report`
- **Type**: `document`
- **URIs**: `/api/documents/document-1`
- **Scopes**: Select `view`, `edit`, `delete`
- Click **Save**

**Create Document 2:**
- **Name**: `document-2`
- **Display name**: `Marketing Strategy 2024`
- **Type**: `document`
- **URIs**: `/api/documents/document-2`
- **Scopes**: Select `view`, `edit`, `delete`
- Click **Save**

**Create Document 3:**
- **Name**: `document-3`
- **Display name**: `Employee Handbook`
- **Type**: `document`
- **URIs**: `/api/documents/document-3`
- **Scopes**: Select `view`, `edit`, `delete`
- Click **Save**

**Create Document 4:**
- **Name**: `document-4`
- **Display name**: `Technical Specifications`
- **Type**: `document`
- **URIs**: `/api/documents/document-4`
- **Scopes**: Select `view`, `edit`, `delete`
- Click **Save**

### **STEP 5: Create Users (if not already created)**

1. Go to **Users** → **Add user**

**Create User A:**
- **Username**: `usera`
- **Email**: `usera@example.com`
- **First name**: `User`
- **Last name**: `A`
- Click **Create**
- Go to **Credentials** tab → Set password

**Create User C:**
- **Username**: `userc`
- **Email**: `userc@example.com`
- **First name**: `User`
- **Last name**: `C`
- Click **Create**
- Go to **Credentials** tab → Set password

**Create User D:**
- **Username**: `userd`
- **Email**: `userd@example.com`
- **First name**: `User`
- **Last name**: `D`
- Click **Create**
- Go to **Credentials** tab → Set password

### **STEP 6: Create Policies**

1. Go to **Authorization** → **Policies** tab
2. Click **Create policy** → Select **User**

**Policy 1: User A Policy**
- **Name**: `user-a-policy`
- **Description**: `Policy for User A`
- **Users**: Select `usera`
- **Logic**: Positive
- Click **Save**

**Policy 2: User C Policy**
- **Name**: `user-c-policy`
- **Description**: `Policy for User C`
- **Users**: Select `userc`
- **Logic**: Positive
- Click **Save**

**Policy 3: User D Policy**
- **Name**: `user-d-policy`
- **Description**: `Policy for User D`
- **Users**: Select `userd`
- **Logic**: Positive
- Click **Save**

### **STEP 7: Create Permissions**

1. Go to **Authorization** → **Permissions** tab
2. Click **Create permission** → Select **Resource-based**

#### **Scenario 1: User A can view Document 1 but not Document 2**

**Permission 1: User A - View Document 1**
- **Name**: `user-a-view-doc-1`
- **Description**: `User A can view Document 1`
- **Resources**: Select `document-1`
- **Scopes**: Select `view`
- **Apply Policy**: Select `user-a-policy`
- **Decision Strategy**: Unanimous
- Click **Save**

**Note:** Don't create any permission for User A + Document 2 = No access

#### **Scenario 2: User C can view and edit Document 1**

**Permission 2: User C - View Document 1**
- **Name**: `user-c-view-doc-1`
- **Resources**: Select `document-1`
- **Scopes**: Select `view`
- **Apply Policy**: Select `user-c-policy`
- Click **Save**

**Permission 3: User C - Edit Document 1**
- **Name**: `user-c-edit-doc-1`
- **Resources**: Select `document-1`
- **Scopes**: Select `edit`
- **Apply Policy**: Select `user-c-policy`
- Click **Save**

#### **Scenario 3: User D can only view Document 1**

**Permission 4: User D - View Document 1**
- **Name**: `user-d-view-doc-1`
- **Resources**: Select `document-1`
- **Scopes**: Select `view`
- **Apply Policy**: Select `user-d-policy`
- Click **Save**

**Note:** Don't create edit/delete permissions for User D

---

## 🧪 Testing the Implementation

### **Test 1: User A**

1. **Login as User A** (`usera`)
2. Go to **Dashboard** → Click **"📄 Document Management"**
3. **Expected Result:**
   - ✅ Can see Document 1
   - ✅ Has "View" permission only
   - ❌ Cannot see Document 2 (no permission)
   - ❌ No Edit or Delete buttons for Document 1

### **Test 2: User C**

1. **Login as User C** (`userc`)
2. Go to **Dashboard** → Click **"📄 Document Management"**
3. **Expected Result:**
   - ✅ Can see Document 1
   - ✅ Has "View" and "Edit" permissions
   - ✅ Can click "Edit" button
   - ❌ No "Delete" button (no delete permission)

### **Test 3: User D**

1. **Login as User D** (`userd`)
2. Go to **Dashboard** → Click **"📄 Document Management"**
3. **Expected Result:**
   - ✅ Can see Document 1
   - ✅ Has "View" permission only
   - ❌ No Edit or Delete buttons

---

## 💻 How to Use in Code

### **Check Permission in Server Component**

```typescript
import { auth } from "@/auth";
import { SessionWithRoles } from "@/types/auth";
import { checkPermissions } from "@/lib/permissions";

export default async function MyPage() {
  const session = (await auth()) as SessionWithRoles | null;
  const permissionChecker = checkPermissions(session);

  // Check if user can view document-1
  const canView = await permissionChecker.canView("document-1");
  
  // Check if user can edit document-1
  const canEdit = await permissionChecker.canEdit("document-1");
  
  // Check if user can delete document-1
  const canDelete = await permissionChecker.canDelete("document-1");
  
  // Check multiple permissions at once
  const permissions = await permissionChecker.checkMultiplePermissions(
    "document-1",
    ["view", "edit", "delete"]
  );
  
  return (
    <div>
      {canView && <p>You can view this document</p>}
      {canEdit && <button>Edit</button>}
      {canDelete && <button>Delete</button>}
    </div>
  );
}
```

### **Protect API Route**

```typescript
import { auth } from "@/auth";
import { SessionWithRoles } from "@/types/auth";
import { requireResourcePermission } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = (await auth()) as SessionWithRoles | null;
  
  // Check permission
  const result = await requireResourcePermission(
    session,
    params.id,
    "view"
  );
  
  if (!result.allowed) {
    return NextResponse.json(
      { error: result.reason || "Permission denied" },
      { status: 403 }
    );
  }
  
  // User has permission - proceed
  return NextResponse.json({ data: "Your data" });
}
```

---

## 🎯 Permission Scenarios

### **Scenario 1: Different Users, Different Permissions**

```
User A → Document 1 → View only
User C → Document 1 → View + Edit
User D → Document 1 → View only
```

### **Scenario 2: Same User, Different Documents**

```
User A → Document 1 → View
User A → Document 2 → No access
User A → Document 3 → View + Edit + Delete
```

### **Scenario 3: Role + Resource Permissions**

```
Admin role → All documents → View + Edit + Delete
Manager role → Department docs → View + Edit
User role → Public docs → View only
```

---

## 🔄 How It Works

### **Permission Check Flow:**

```
1. User requests document
   ↓
2. App extracts access token from session
   ↓
3. App calls Keycloak Authorization API
   ↓
4. Keycloak checks:
   - Does user exist?
   - Does resource exist?
   - Does user have policy assigned?
   - Does policy grant the requested scope?
   ↓
5. Keycloak returns: Allowed or Denied
   ↓
6. App shows/hides UI or allows/denies API access
```

### **Under the Hood:**

```typescript
// Permission check makes this API call to Keycloak:
POST http://localhost:8080/realms/myrealm/protocol/openid-connect/token

Body:
  grant_type: urn:ietf:params:oauth:grant-type:uma-ticket
  audience: myclient
  permission: document-1#view
  subject_token: <user's access token>

Response (if allowed):
  { access_token: "..." }

Response (if denied):
  { error: "access_denied" }
```

---

## 📊 Permission Matrix Example

| User | Document 1 | Document 2 | Document 3 | Document 4 |
|------|-----------|-----------|-----------|-----------|
| **User A** | View | ❌ No Access | View, Edit | View |
| **User C** | View, Edit | View | ❌ No Access | View, Edit, Delete |
| **User D** | View | View, Edit | View | ❌ No Access |
| **Admin** | All | All | All | All |

---

## 🚀 Advanced Features

### **1. Group-Based Permissions**

Instead of assigning to individual users, assign to groups:

1. Create groups in Keycloak
2. Add users to groups
3. Create **Group Policy** instead of User Policy
4. Assign permissions to group policy

### **2. Time-Based Permissions**

Allow access only during specific times:

1. Create **Time Policy**
2. Set start/end times
3. Combine with user/group policy

### **3. JavaScript Policies**

Custom logic for permissions:

```javascript
// Example: Allow edit only if user is owner
var context = $evaluation.getContext();
var identity = context.getIdentity();
var resource = $evaluation.getPermission().getResource();

if (resource.getOwner() === identity.getId()) {
  $evaluation.grant();
} else {
  $evaluation.deny();
}
```

---

## ⚠️ Important Notes

1. **Performance**: Each permission check makes an API call to Keycloak. Cache results when possible.
2. **Security**: Always check permissions on the server, never trust client-side checks.
3. **Token Expiry**: Access tokens expire. Handle token refresh properly.
4. **Error Handling**: Always handle permission denied gracefully in your UI.

---

## 🐛 Troubleshooting

### **Problem: Permission always denied**

**Check:**
- ✅ Resource exists in Keycloak
- ✅ Scope exists and is assigned to resource
- ✅ Policy exists and includes the user
- ✅ Permission exists linking resource + scope + policy
- ✅ User is logged in with valid token

### **Problem: "Invalid token" error**

**Solution:**
- Logout and login again to get fresh token
- Check that access token is being stored in session

### **Problem: All documents show "No access"**

**Check:**
- ✅ Authorization is enabled in Keycloak client
- ✅ Client secret is correct in `auth.config.ts`
- ✅ Permissions are created for the user

---

## 📚 Summary

**What you've implemented:**
- ✅ Resource-based permissions (documents)
- ✅ Per-resource scopes (view, edit, delete)
- ✅ User-specific access control
- ✅ Real-time permission checking
- ✅ Document management UI

**Next steps:**
1. Create users in Keycloak
2. Assign permissions as per scenarios
3. Test with different users
4. Extend to more resources (reports, files, etc.)

For more information, see the [Keycloak Authorization Services Documentation](https://www.keycloak.org/docs/latest/authorization_services/).
