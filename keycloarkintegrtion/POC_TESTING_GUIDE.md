# POC Testing Guide - Resource-Based Permissions

## 🎯 Quick Start (15 Minutes)

### **Option 1: Reports API (Recommended)**

**Easiest scenario for POC testing**

#### **Step 1: Keycloak Setup (5 min)**

```
1. Go to Keycloak Admin Console
2. Clients → myclient → Authorization

3. Create Scopes:
   - view
   - edit
   - delete

4. Create Resource:
   - Name: reports-api
   - Type: api
   - URIs: /api/reports
   - Scopes: view, edit, delete

5. Create Policies (for each user):
   - user-a-policy (select User A)
   - user-c-policy (select User C)
   - user-d-policy (select User D)

6. Create Permissions:
   - user-a-view-reports (reports-api + view + user-a-policy)
   - user-c-view-reports (reports-api + view + user-c-policy)
   - user-c-edit-reports (reports-api + edit + user-c-policy)
   - user-d-view-reports (reports-api + view + user-d-policy)
```

#### **Step 2: Test in App (5 min)**

```
1. Login as User A
2. Go to Dashboard → "📊 Reports API Testing"
3. Click "Test VIEW Permission" → Should show ✅
4. Click "Test EDIT Permission" → Should show ❌
5. Click "Test DELETE Permission" → Should show ❌

6. Logout and login as User C
7. Click "Test VIEW Permission" → Should show ✅
8. Click "Test EDIT Permission" → Should show ✅
9. Click "Test DELETE Permission" → Should show ❌

10. Logout and login as User D
11. Click "Test VIEW Permission" → Should show ✅
12. Click "Test EDIT Permission" → Should show ❌
13. Click "Test DELETE Permission" → Should show ❌
```

#### **Step 3: Verify Results (5 min)**

```
Expected Results:

User A:
✅ View: GRANTED
❌ Edit: DENIED
❌ Delete: DENIED

User C:
✅ View: GRANTED
✅ Edit: GRANTED
❌ Delete: DENIED

User D:
✅ View: GRANTED
❌ Edit: DENIED
❌ Delete: DENIED
```

---

### **Option 2: Document Management**

**More complex, realistic scenario**

#### **Step 1: Keycloak Setup (10 min)**

```
Same as Reports API, but create 4 resources:
- document-1
- document-2
- document-3
- document-4

Then create permissions for each user + document combination
```

#### **Step 2: Test in App (5 min)**

```
1. Login as User A
2. Go to Dashboard → "📄 Document Management"
3. Should see: Document 1 only (View permission)
4. Should NOT see: Documents 2, 3, 4

5. Logout and login as User C
6. Should see: Document 1 (View + Edit buttons)
7. Should NOT see: Documents 2, 3, 4

8. Logout and login as User D
9. Should see: Document 1 only (View permission)
10. Should NOT see: Documents 2, 3, 4
```

---

## 📊 Comparison

| Aspect | Reports API | Documents |
|--------|------------|-----------|
| **Setup Time** | 5 min | 10 min |
| **Testing Time** | 5 min | 5 min |
| **Complexity** | Low | Medium |
| **Resources** | 1 | 4 |
| **Best For** | Quick POC | Realistic Use |

---

## 🔑 Key Points

### **What You're Testing:**

1. **Resource Creation** - Define what to protect
2. **Scope Definition** - Define what actions are allowed
3. **Policy Creation** - Define who can do what
4. **Permission Linking** - Connect resource + scope + policy
5. **Real-time Checking** - Verify permissions work

### **How It Works:**

```
User Request
    ↓
App checks permission with Keycloak
    ↓
Keycloak evaluates: User + Resource + Scope
    ↓
Returns: Allowed or Denied
    ↓
App shows/hides features accordingly
```

---

## 🎯 Success Criteria

✅ **Reports API Scenario:**
- User A can view reports only
- User C can view and edit reports
- User D can view reports only
- Each user sees different permission results

✅ **Documents Scenario:**
- User A sees Document 1 only
- User C sees Document 1 with Edit button
- User D sees Document 1 only
- Other documents are hidden

---

## 🚀 Next Steps After POC

1. **Understand the flow** - How permissions are checked
2. **Extend to more resources** - Add more documents/APIs
3. **Add more users** - Test with different user groups
4. **Implement in production** - Use for real access control
5. **Explore advanced features** - Groups, time-based, attributes

---

## 📚 Documentation

- **Quick Start:** `PERMISSIONS_QUICK_START.md`
- **Reports API:** `REPORTS_API_SCENARIO.md`
- **Documents:** `RESOURCE_PERMISSIONS_GUIDE.md`
- **All Scenarios:** `PERMISSION_SCENARIOS.md`

---

## 💡 Tips

1. **Start with Reports API** - Simpler, faster feedback
2. **Use the same 3 users** - Consistent testing
3. **Test one user at a time** - Clear results
4. **Check Keycloak logs** - Debug permission issues
5. **Logout/Login** - Refresh permissions after changes

---

## ⚠️ Common Issues

### **Issue: All users see "Permission Denied"**
**Solution:** Check that permissions are created in Keycloak

### **Issue: Scopes not appearing in permission form**
**Solution:** Keep "Apply to resource type" toggle OFF

### **Issue: Permission changes not reflected**
**Solution:** Logout and login again to refresh token

---

## 🎉 Summary

**You have everything ready for POC testing!**

1. ✅ Code is implemented
2. ✅ UI pages are created
3. ✅ API endpoints are protected
4. ✅ Documentation is complete

**Just follow the Keycloak setup steps and test!**

**Recommended:** Start with Reports API (15 minutes total) 🚀
