# ABAC Quick Start Guide

## ⚡ 5-Minute Setup

### **Step 1: Create Users in Keycloak (2 min)**

1. Go to **Keycloak Admin Console** → **Users**
2. Click **"Add user"** → Create **ram**
   - Username: `ram`
   - Email: `ram@example.com`
   - **Save**
   - Go to **Credentials** → Set password
   - Go to **Attributes** → Add:
     - **Key:** `role`
     - **Value:** `admin`
   - Click **Add** → **Save**

3. Create **alice**
   - Username: `alice`
   - Email: `alice@example.com`
   - **Save**
   - Go to **Credentials** → Set password
   - Go to **Attributes** → Add:
     - **Key:** `role`
     - **Value:** `projectmanager`
   - Click **Add** → **Save**

4. Create **bob**
   - Username: `bob`
   - Email: `bob@example.com`
   - **Save**
   - Go to **Credentials** → Set password
   - Go to **Attributes** → Add:
     - **Key:** `role`
     - **Value:** `lead`
   - Click **Add** → **Save**

### **Step 2: Configure Token Mapper (2 min)**

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

### **Step 3: Test (1 min)**

1. Go to `/abac` page
2. Login as each user
3. Verify permissions

---

## 🧪 Testing

### **Test as ram (Admin)**

1. Login as `ram`
2. Go to `/abac`
3. Verify:
   - ✅ Role: **admin**
   - ✅ Admin Status: **Yes**
   - ✅ Projects: View, Create, Edit, Delete
   - ✅ Resources: View, Create, Edit, Delete

### **Test as alice (ProjectManager)**

1. Logout and login as `alice`
2. Go to `/abac`
3. Verify:
   - ✅ Role: **projectmanager**
   - ✅ ProjectManager Status: **Yes**
   - ✅ Projects: View, Create, Edit (NOT Delete)
   - ❌ Resources: No access

### **Test as bob (Lead)**

1. Logout and login as `bob`
2. Go to `/abac`
3. Verify:
   - ✅ Role: **lead**
   - ✅ Lead Status: **Yes**
   - ❌ Projects: No access
   - ✅ Resources: View, Create, Edit (NOT Delete)

---

## 📊 Expected Access Matrix

| User | Role | Projects | Resources | Delete |
|------|------|----------|-----------|--------|
| **ram** | admin | ✅ All | ✅ All | ✅ Yes |
| **alice** | projectmanager | ✅ View, Create, Edit | ❌ None | ❌ No |
| **bob** | lead | ❌ None | ✅ View, Create, Edit | ❌ No |

---

## 🔗 URLs to Test

- **Dashboard:** `http://localhost:3000/dashboard`
- **ABAC Testing:** `http://localhost:3000/abac`
- **API Endpoint:** `POST /api/abac/check`

---

## 📝 Code Usage

### **Check if User is Admin**

```typescript
import { isAdmin } from "@/lib/abac";

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

## ✅ Checklist

- [ ] Created users (ram, alice, bob) in Keycloak
- [ ] Added role attributes to each user
- [ ] Configured token mapper for role attribute
- [ ] Tested `/abac` page with each user
- [ ] Verified access matrix matches expectations
- [ ] Tested API endpoints

---

## 🚀 Next Steps

1. **Extend Roles:** Add more roles as needed
2. **Add Resources:** Create more resource types
3. **Custom Rules:** Implement custom access rules
4. **Production:** Deploy to production Keycloak

---

## 📚 Full Documentation

See `ABAC_IMPLEMENTATION.md` for:
- Complete implementation details
- Advanced use cases
- Code examples
- Troubleshooting

---

## ✨ Summary

You now have a working **ABAC system** with:
- ✅ Attribute-based access control
- ✅ Three roles with different permissions
- ✅ Resource-specific access rules
- ✅ Real-time permission evaluation
- ✅ Easy to extend

**Start testing now!** 🎉
