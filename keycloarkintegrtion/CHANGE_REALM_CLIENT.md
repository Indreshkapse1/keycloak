# How to Change Realm and Client Name

## 📝 Files to Update

You need to update **2 main files**:

### **File 1: `auth.config.ts`**
Location: `c:\Users\indresh.kapse\Documents\DockerInit\keycloarkintegrtion\auth.config.ts`

**Lines to change:**
- Line 26: `clientId: "myclient"` → Change to your client ID
- Line 28: `issuer: "http://localhost:8080/realms/myrealm"` → Change realm name

### **File 2: `lib/permissions.ts`**
Location: `c:\Users\indresh.kapse\Documents\DockerInit\keycloarkintegrtion\lib\permissions.ts`

**Lines to change:**
- Line 26: `http://localhost:8080/realms/myrealm/protocol/...` → Change realm name
- Line 34: `audience: "myclient"` → Change to your client ID

---

## 🔄 Step-by-Step Changes

### **Step 1: Update `auth.config.ts`**

**Current:**
```typescript
Keycloak({
  clientId: "myclient",
  clientSecret: "PX7OSn5NCZAPKZQI3ja4QAWYShzK52lu",
  issuer: "http://localhost:8080/realms/myrealm",
  ...
})
```

**Change to (example with new realm/client):**
```typescript
Keycloak({
  clientId: "mynewclient",              // ← Change this
  clientSecret: "PX7OSn5NCZAPKZQI3ja4QAWYShzK52lu",
  issuer: "http://localhost:8080/realms/mynewrealm",  // ← Change this
  ...
})
```

### **Step 2: Update `lib/permissions.ts`**

**Current (Line 26):**
```typescript
`http://localhost:8080/realms/myrealm/protocol/openid-connect/token`
```

**Change to:**
```typescript
`http://localhost:8080/realms/mynewrealm/protocol/openid-connect/token`
```

**Current (Line 34):**
```typescript
audience: "myclient",
```

**Change to:**
```typescript
audience: "mynewclient",
```

---

## 📋 Complete List of Changes

| File | Line | Current | Change To |
|------|------|---------|-----------|
| `auth.config.ts` | 26 | `clientId: "myclient"` | `clientId: "YOUR_NEW_CLIENT"` |
| `auth.config.ts` | 28 | `issuer: "http://localhost:8080/realms/myrealm"` | `issuer: "http://localhost:8080/realms/YOUR_NEW_REALM"` |
| `lib/permissions.ts` | 26 | `http://localhost:8080/realms/myrealm/protocol/...` | `http://localhost:8080/realms/YOUR_NEW_REALM/protocol/...` |
| `lib/permissions.ts` | 34 | `audience: "myclient"` | `audience: "YOUR_NEW_CLIENT"` |

---

## 🔍 Optional: Check for Other References

There might be other references in documentation or comments. Search for:

```
myrealm
myclient
```

In these files:
- `app/client-admin/page.tsx` - May have comments
- `app/dashboard/page.tsx` - May have comments
- `lib/roles.ts` - May have references

But these are usually just for display/comments, not critical for functionality.

---

## ✅ Example: Changing to "acmerealm" and "acmeclient"

### **In `auth.config.ts`:**
```typescript
Keycloak({
  clientId: "acmeclient",                                    // Changed
  clientSecret: "PX7OSn5NCZAPKZQI3ja4QAWYShzK52lu",
  issuer: "http://localhost:8080/realms/acmerealm",         // Changed
  ...
})
```

### **In `lib/permissions.ts`:**
```typescript
const response = await fetch(
  `http://localhost:8080/realms/acmerealm/protocol/openid-connect/token`,  // Changed
  {
    ...
    body: new URLSearchParams({
      ...
      audience: "acmeclient",                               // Changed
      ...
    }),
  }
);
```

---

## 🧪 After Changing

1. **Update Keycloak** - Create new realm and client with new names
2. **Update code** - Change the 4 references above
3. **Restart dev server** - `npm run dev`
4. **Test login** - Should work with new realm/client

---

## 🎯 Quick Summary

**2 files to update:**
1. `auth.config.ts` - 2 changes (clientId, issuer)
2. `lib/permissions.ts` - 2 changes (realm URL, audience)

**Total: 4 changes needed**

---

## 💡 Important Notes

- ⚠️ Client secret stays the same (unless you change it in Keycloak)
- ⚠️ Realm URL format: `http://localhost:8080/realms/YOUR_REALM_NAME`
- ⚠️ After changing, restart the dev server
- ⚠️ Make sure new realm and client exist in Keycloak first

---

## 🚀 Done!

Once you make these 4 changes, your app will use the new realm and client! 🎉
