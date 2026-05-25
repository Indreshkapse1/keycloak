# Fix Keycloak Permissions - Step by Step

## 🔴 Problems Found

1. ❌ All permissions are "Scope" type → Should be "Resource" type
2. ❌ Decision strategy is "UNANIMOUS" → Should be "AFFIRMATIVE"
3. ❌ Permissions point to wrong policies
4. ❌ Duplicate policies (user-b-policy)

---

## ✅ Solution: Clean Up and Recreate

### **Step 1: Delete All Permissions**

1. Go to **Keycloak Admin Console**
2. **Clients** → **myclient** → **Authorization** → **Permissions**
3. Delete ALL permissions:
   - user-a-view-doc-1
   - user-c-policy
   - user-a-view-reports
   - user-c-view-reports
   - user-c-edit-reports
   - user-d-delete-reports
   - test

### **Step 2: Delete Duplicate Policies**

1. Go to **Authorization** → **Policies**
2. Delete:
   - user-b-policy (duplicate)
   - user-c-doc-1-policy (rename confusion)

Keep only:
- user-a-policy
- user-c-policy
- user-d-policy

### **Step 3: Verify Policies Point to Correct Users**

1. Go to **Authorization** → **Policies**
2. Edit each policy:

**user-a-policy:**
- Users: `myuser` ✅

**user-c-policy:**
- Users: `myuser2` ✅

**user-d-policy:**
- Users: `myuser3` ✅

### **Step 4: Create Permissions (Correct Way)**

1. Go to **Authorization** → **Permissions**
2. Click **"Create permission"**
3. Select **"Resource-based"** (NOT Scope-based)

**Permission 1: user-a-view-reports**
```
Name: user-a-view-reports
Description: User A can view reports
Type: Resource-based
Resources: reports-api
Scopes: view
Associated policy: user-a-policy
Decision strategy: Affirmative
Click Save
```

**Permission 2: user-c-view-reports**
```
Name: user-c-view-reports
Description: User C can view reports
Type: Resource-based
Resources: reports-api
Scopes: view
Associated policy: user-c-policy
Decision strategy: Affirmative
Click Save
```

**Permission 3: user-c-edit-reports**
```
Name: user-c-edit-reports
Description: User C can edit reports
Type: Resource-based
Resources: reports-api
Scopes: edit
Associated policy: user-c-policy
Decision strategy: Affirmative
Click Save
```

**Permission 4: user-d-view-reports**
```
Name: user-d-view-reports
Description: User D can view reports
Type: Resource-based
Resources: reports-api
Scopes: view
Associated policy: user-d-policy
Decision strategy: Affirmative
Click Save
```

---

## 🎯 Final Configuration Should Look Like

### **Policies (3 total):**
```
user-a-policy → myuser
user-c-policy → myuser2
user-d-policy → myuser3
```

### **Permissions (4 total):**
```
user-a-view-reports
  - Type: Resource-based
  - Resource: reports-api
  - Scope: view
  - Policy: user-a-policy

user-c-view-reports
  - Type: Resource-based
  - Resource: reports-api
  - Scope: view
  - Policy: user-c-policy

user-c-edit-reports
  - Type: Resource-based
  - Resource: reports-api
  - Scope: edit
  - Policy: user-c-policy

user-d-view-reports
  - Type: Resource-based
  - Resource: reports-api
  - Scope: view
  - Policy: user-d-policy
```

---

## 🧪 Test After Fixing

1. **Logout** from your app
2. **Login as myuser** (User A)
3. Go to `/reports`
4. Click "Test VIEW Permission" → Should show ✅
5. Click "Test EDIT Permission" → Should show ❌
6. Click "Test DELETE Permission" → Should show ❌

7. **Logout and login as myuser2** (User C)
8. Click "Test VIEW Permission" → Should show ✅
9. Click "Test EDIT Permission" → Should show ✅
10. Click "Test DELETE Permission" → Should show ❌

11. **Logout and login as myuser3** (User D)
12. Click "Test VIEW Permission" → Should show ✅
13. Click "Test EDIT Permission" → Should show ❌
14. Click "Test DELETE Permission" → Should show ❌

---

## 📝 Key Points

| Setting | Wrong | Correct |
|---------|-------|---------|
| **Permission Type** | Scope | Resource |
| **Decision Strategy** | UNANIMOUS | AFFIRMATIVE |
| **Policies** | 4 (with duplicates) | 3 (clean) |
| **Permissions** | 6 (mixed types) | 4 (all resource) |

---

## 🚀 After Fixing

Everything should work! The key was:
1. ✅ Change permission type from Scope to Resource
2. ✅ Change decision strategy from UNANIMOUS to AFFIRMATIVE
3. ✅ Remove duplicate policies
4. ✅ Point permissions to correct policies

**Try these fixes and permissions should work!** 🎉
