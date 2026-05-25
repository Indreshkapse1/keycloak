# Quick Reference - Resource-Based Permissions

## 🎯 At a Glance

### **What You Have**
- ✅ Reports API scenario (1 resource, 3 scopes)
- ✅ Documents scenario (4 resources, 3 scopes)
- ✅ Permission checking utilities
- ✅ API protection
- ✅ UI pages for testing

### **What You Need to Do**
- ⏳ Create resources in Keycloak
- ⏳ Create scopes in Keycloak
- ⏳ Create policies in Keycloak
- ⏳ Create permissions in Keycloak
- ⏳ Test with your users

---

## 🚀 5-Minute Setup

### **Step 1: Create Scopes (1 min)**
```
Keycloak → Authorization → Scopes
Create: view, edit, delete
```

### **Step 2: Create Resource (1 min)**
```
Keycloak → Authorization → Resources
Create: reports-api
Add Scopes: view, edit, delete
```

### **Step 3: Create Policies (1 min)**
```
Keycloak → Authorization → Policies
Create: user-a-policy (select User A)
Create: user-c-policy (select User C)
Create: user-d-policy (select User D)
```

### **Step 4: Create Permissions (2 min)**
```
Keycloak → Authorization → Permissions

user-a-view-reports:
- Resource: reports-api
- Scope: view
- Policy: user-a-policy

user-c-view-reports:
- Resource: reports-api
- Scope: view
- Policy: user-c-policy

user-c-edit-reports:
- Resource: reports-api
- Scope: edit
- Policy: user-c-policy

user-d-view-reports:
- Resource: reports-api
- Scope: view
- Policy: user-d-policy
```

---

## 🧪 5-Minute Testing

### **Test Reports API**
```
1. Go to http://localhost:3000/dashboard
2. Click "📊 Reports API Testing"
3. Click "Test VIEW Permission"
4. Click "Test EDIT Permission"
5. Click "Test DELETE Permission"
6. See results!
```

### **Test Documents**
```
1. Go to http://localhost:3000/dashboard
2. Click "📄 Document Management"
3. See accessible documents
4. Click "View Details"
5. See your permissions!
```

---

## 📊 Permission Matrix

### **Reports API**

| User | View | Edit | Delete |
|------|------|------|--------|
| A | ✅ | ❌ | ❌ |
| C | ✅ | ✅ | ❌ |
| D | ✅ | ❌ | ❌ |

### **Documents**

| User | Doc 1 | Doc 2 | Doc 3 | Doc 4 |
|------|-------|-------|-------|-------|
| A | View | ❌ | ? | ? |
| C | View+Edit | ? | ❌ | ? |
| D | View | ? | ? | ❌ |

---

## 🔑 Key Keycloak Terms

| Term | Meaning | Example |
|------|---------|---------|
| **Resource** | Thing to protect | reports-api, document-1 |
| **Scope** | Action allowed | view, edit, delete |
| **Policy** | Who can do what | User A, User C, User D |
| **Permission** | Links all three | User A can view reports-api |

---

## 💻 Code Snippets

### **Check Permission**
```typescript
const permissionChecker = checkPermissions(session);
const canView = await permissionChecker.canView("reports-api");
```

### **Protect API**
```typescript
const result = await requireResourcePermission(
  session,
  "reports-api",
  "view"
);
if (!result.allowed) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```

### **Show/Hide UI**
```typescript
{permissions.canEdit && <button>Edit</button>}
{permissions.canDelete && <button>Delete</button>}
```

---

## 📍 URLs

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/dashboard` | Main hub |
| Reports | `/reports` | Test Reports API |
| Documents | `/documents` | Test Documents |
| Document Detail | `/documents/[id]` | View document |

---

## 🔗 API Endpoints

| Endpoint | Method | Permission | Purpose |
|----------|--------|-----------|---------|
| `/api/reports` | GET | view | Get reports |
| `/api/reports` | PUT | edit | Update reports |
| `/api/reports` | DELETE | delete | Delete reports |
| `/api/documents` | GET | view | List documents |
| `/api/documents/[id]` | GET | view | Get document |
| `/api/documents/[id]` | PUT | edit | Update document |
| `/api/documents/[id]` | DELETE | delete | Delete document |

---

## 📚 Documentation

| File | Purpose | Time |
|------|---------|------|
| `POC_TESTING_GUIDE.md` | Start here | 5 min |
| `REPORTS_API_SCENARIO.md` | Reports setup | 10 min |
| `RESOURCE_PERMISSIONS_GUIDE.md` | Documents setup | 15 min |
| `PERMISSION_SCENARIOS.md` | All options | 10 min |
| `FINAL_SUMMARY.md` | Complete overview | 10 min |

---

## ✅ Checklist

### **Setup**
- [ ] Create scopes in Keycloak
- [ ] Create resource in Keycloak
- [ ] Create policies in Keycloak
- [ ] Create permissions in Keycloak

### **Testing**
- [ ] Test User A permissions
- [ ] Test User C permissions
- [ ] Test User D permissions
- [ ] Verify expected results

### **Verification**
- [ ] Reports API works
- [ ] Documents page works
- [ ] Permissions are enforced
- [ ] UI shows correct buttons

---

## 🎯 Success Criteria

✅ **User A** can view reports only
✅ **User C** can view and edit reports
✅ **User D** can view reports only
✅ Each user sees different results
✅ Permissions are real-time

---

## 🚀 Next Steps

1. **Read:** `POC_TESTING_GUIDE.md`
2. **Setup:** Follow Keycloak steps (5 min)
3. **Test:** Go to `/reports` (5 min)
4. **Verify:** See permissions work! ✅

---

## 💡 Tips

- Start with Reports API (simpler)
- Use same 3 users for consistency
- Logout/login to refresh permissions
- Check Keycloak logs if issues
- Read the full guides for details

---

## 🎉 You're Ready!

Everything is set up. Just follow the Keycloak steps and test! 🚀
