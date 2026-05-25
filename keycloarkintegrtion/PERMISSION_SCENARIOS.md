# Permission Testing Scenarios

## 🎯 Available Scenarios

You now have multiple scenarios to test resource-based permissions:

---

## **Scenario 1: Reports API** ⭐ (Recommended for POC)

**Best for:** Quick testing, single resource, clear feedback

### **What it does:**
- Test view, edit, delete permissions on a single API endpoint
- Click buttons to test each permission
- See immediate success/failure feedback

### **Setup:**
- 1 resource: `reports-api`
- 3 scopes: view, edit, delete
- 3 users with different permissions

### **Testing:**
```
Go to /reports → Click permission buttons → See results
```

### **Files:**
- `app/api/reports/route.ts`
- `app/reports/page.tsx`
- `REPORTS_API_SCENARIO.md`

---

## **Scenario 2: Document Management**

**Best for:** Complex scenarios, multiple resources, realistic use case

### **What it does:**
- Manage access to multiple documents
- Each user sees only documents they can access
- Different permissions per document per user

### **Setup:**
- 4 resources: document-1, document-2, document-3, document-4
- 3 scopes: view, edit, delete
- 3 users with different document access

### **Testing:**
```
Go to /documents → See accessible documents → View details
```

### **Files:**
- `app/api/documents/route.ts`
- `app/api/documents/[id]/route.ts`
- `app/documents/page.tsx`
- `app/documents/[id]/page.tsx`
- `RESOURCE_PERMISSIONS_GUIDE.md`

---

## **Scenario 3: Feature Flags** (Coming Soon)

**Best for:** Feature-based access control

### **What it does:**
- Control access to features based on permissions
- Different users see different features
- Enable/disable features per user

### **Example:**
```
User A → Can see "Dashboard" feature
User B → Can see "Dashboard" + "Analytics" features
User C → Can see all features
```

---

## **Scenario 4: Data Access Levels** (Coming Soon)

**Best for:** Hierarchical data access

### **What it does:**
- Different access levels for different data
- User A: Public data only
- User B: Public + Internal data
- User C: All data (Public + Internal + Confidential)

---

## **Scenario 5: UI Components** (Coming Soon)

**Best for:** Component-level permission control

### **What it does:**
- Show/hide UI buttons based on permissions
- User A: See "View" button only
- User B: See "View" + "Edit" buttons
- User C: See all buttons (View, Edit, Delete)

---

## 🚀 Quick Comparison

| Scenario | Complexity | Resources | Best For | Status |
|----------|-----------|-----------|----------|--------|
| **Reports API** | ⭐ Low | 1 | POC Testing | ✅ Ready |
| **Documents** | ⭐⭐ Medium | 4 | Realistic Use | ✅ Ready |
| **Feature Flags** | ⭐⭐ Medium | N/A | Feature Control | 🔜 Soon |
| **Data Levels** | ⭐⭐⭐ High | 3 | Hierarchical | 🔜 Soon |
| **UI Components** | ⭐ Low | 1 | UI Control | 🔜 Soon |

---

## 📋 Recommended Testing Order

### **For Quick POC (30 minutes):**
1. **Start with Reports API** ← Easiest, fastest feedback
2. Test with 3 users
3. See permissions work in real-time

### **For Complete Testing (2 hours):**
1. **Reports API** (15 min) - Understand basics
2. **Documents** (45 min) - Multiple resources
3. **Feature Flags** (30 min) - Feature control
4. **Data Levels** (30 min) - Hierarchical access

---

## 🔧 How to Switch Scenarios

### **To Test Reports API:**
```
1. Go to Dashboard
2. Click "📊 Reports API Testing"
3. Click permission buttons
```

### **To Test Documents:**
```
1. Go to Dashboard
2. Click "📄 Document Management"
3. See accessible documents
```

---

## 📝 Keycloak Setup Summary

### **For Reports API:**
```
1 Resource (reports-api)
3 Scopes (view, edit, delete)
3 Policies (one per user)
4 Permissions (different for each user)
```

### **For Documents:**
```
4 Resources (document-1, 2, 3, 4)
3 Scopes (view, edit, delete)
3 Policies (one per user)
10+ Permissions (different for each user + document)
```

---

## 💡 Key Concepts

### **Resource**
A thing you want to protect (API endpoint, document, feature, etc.)

### **Scope**
An action you can perform (view, edit, delete, etc.)

### **Policy**
A rule that defines who can do what (User A, User B, etc.)

### **Permission**
Links resource + scope + policy together

---

## 🎯 Next Steps

1. **Choose a scenario** (Start with Reports API)
2. **Follow the setup guide** for that scenario
3. **Create resources, scopes, policies in Keycloak**
4. **Test with your users**
5. **See permissions work!**

---

## 📚 Documentation Files

- `REPORTS_API_SCENARIO.md` - Reports API setup & testing
- `RESOURCE_PERMISSIONS_GUIDE.md` - Documents setup & testing
- `PERMISSIONS_QUICK_START.md` - Quick reference
- `PERMISSION_SCENARIOS.md` - This file

---

## ✨ Summary

You have **multiple scenarios** to explore resource-based permissions:

✅ **Reports API** - Simple, fast, perfect for POC
✅ **Documents** - Complex, realistic, multiple resources
🔜 **Feature Flags** - Feature-based control
🔜 **Data Levels** - Hierarchical access
🔜 **UI Components** - Component-level control

**Start with Reports API, then explore others!** 🚀
