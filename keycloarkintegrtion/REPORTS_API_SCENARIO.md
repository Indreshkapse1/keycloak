# Reports API - Permission Testing Scenario

## 🎯 Overview

This is a **simpler POC scenario** for testing resource-based permissions without needing actual documents.

**Resource:** `reports-api`
**Scopes:** view, edit, delete
**Users:** Your 3 test users

---

## 📋 Keycloak Setup (Quick)

### **Step 1: Create Scope**

```
Authorization → Scopes → Create scope
- Name: view
- Name: edit
- Name: delete
```

### **Step 2: Create Resource**

```
Authorization → Resources → Create resource

Name: reports-api
Type: api
URIs: /api/reports
Scopes: view, edit, delete
```

### **Step 3: Create Policies**

```
Authorization → Policies → Create policy (User type)

- user-a-policy (select your first user)
- user-c-policy (select your second user)
- user-d-policy (select your third user)
```

### **Step 4: Create Permissions**

```
Authorization → Permissions → Create permission (Resource-based)

Keep "Apply to resource type" OFF

User A - View Permission:
- Name: user-a-view-reports
- Resource: reports-api
- Scopes: view
- Policy: user-a-policy
- Save

User C - View Permission:
- Name: user-c-view-reports
- Resource: reports-api
- Scopes: view
- Policy: user-c-policy
- Save

User C - Edit Permission:
- Name: user-c-edit-reports
- Resource: reports-api
- Scopes: edit
- Policy: user-c-policy
- Save

User D - View Permission:
- Name: user-d-view-reports
- Resource: reports-api
- Scopes: view
- Policy: user-d-policy
- Save
```

---

## 🧪 Testing

### **Step 1: Go to Reports Page**

```
1. Login to your app
2. Go to Dashboard
3. Click "📊 Reports API Testing"
```

### **Step 2: Test Permissions**

You'll see 3 buttons:
- **Test VIEW Permission** - Tests if you can view reports
- **Test EDIT Permission** - Tests if you can edit reports
- **Test DELETE Permission** - Tests if you can delete reports

### **Expected Results:**

#### **User A:**
```
✅ VIEW Permission: GRANTED
❌ EDIT Permission: DENIED
❌ DELETE Permission: DENIED
```

#### **User C:**
```
✅ VIEW Permission: GRANTED
✅ EDIT Permission: GRANTED
❌ DELETE Permission: DENIED
```

#### **User D:**
```
✅ VIEW Permission: GRANTED
❌ EDIT Permission: DENIED
❌ DELETE Permission: DENIED
```

---

## 🔍 How It Works

### **Permission Check Flow:**

```
1. User clicks "Test VIEW Permission"
   ↓
2. App calls GET /api/reports
   ↓
3. API checks: Can this user view "reports-api"?
   ↓
4. Keycloak checks permissions
   ↓
5. Returns: Success with data OR Permission Denied
```

### **API Endpoints:**

```
GET /api/reports
- Requires: view scope
- Returns: List of reports

PUT /api/reports
- Requires: edit scope
- Returns: Update confirmation

DELETE /api/reports
- Requires: delete scope
- Returns: Delete confirmation
```

---

## 💡 Why This Scenario is Better for POC

✅ **No documents needed** - Works with API resources
✅ **Easy to test** - Just click buttons
✅ **Clear feedback** - See permission granted/denied immediately
✅ **Realistic** - Tests actual API permission checking
✅ **Scalable** - Can add more resources/scopes easily

---

## 🚀 Next Steps

1. **Create the resource in Keycloak** (reports-api)
2. **Create policies** for your 3 users
3. **Create permissions** linking users → resource → scopes
4. **Test each user** with the Reports page
5. **See permissions work in real-time!**

---

## 📊 Permission Matrix

| User | View | Edit | Delete |
|------|------|------|--------|
| User A | ✅ | ❌ | ❌ |
| User C | ✅ | ✅ | ❌ |
| User D | ✅ | ❌ | ❌ |

---

## 🎯 Key Difference from Documents Scenario

| Aspect | Documents | Reports API |
|--------|-----------|-------------|
| **Resource Type** | Specific documents | API endpoint |
| **Setup** | Create 4 resources | Create 1 resource |
| **Testing** | View document list | Click permission buttons |
| **Feedback** | See/hide documents | See success/error messages |
| **Complexity** | Higher | Lower |

---

## 📝 Code Files

- `app/api/reports/route.ts` - API endpoints with permission checks
- `app/reports/page.tsx` - UI for testing permissions
- `lib/permissions.ts` - Permission checker (reused from documents)

---

## ✨ Summary

**Reports API scenario is perfect for POC because:**
1. Single resource to manage
2. Clear permission testing
3. Real-time feedback
4. No data dependencies
5. Easy to extend to other scenarios

**Start with this, then extend to documents or other resources!** 🚀
