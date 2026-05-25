# Project Architecture - Keycloak Integration with Next.js

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                        │
├─────────────────────────────────────────────────────────────────┤
│  Next.js Frontend (React Components + Server Actions)          │
├─────────────────────────────────────────────────────────────────┤
│                    NextAuth.js Middleware                      │
├─────────────────────────────────────────────────────────────────┤
│                     API Routes (Server)                       │
├─────────────────────────────────────────────────────────────────┤
│                   Keycloak Integration                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Authentication │  │  Authorization  │  │   User Mgmt     │ │
│  │     (OIDC)      │  │     (UMA)       │  │   (Roles)       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
keycloarkintegrtion/
├── 📁 app/                          # Next.js App Router
│   ├── 📄 page.tsx                  # Landing Page (/)
│   ├── 📄 layout.tsx                # Root Layout + SessionProvider
│   ├── 📄 providers.tsx             # NextAuth SessionProvider Wrapper
│   │
│   ├── 📁 login/                    # Login Pages
│   │   ├── 📄 page.tsx              # Login Page (unused now)
│   │   └── 📄 LoginButton.tsx       # Login Button Component
│   │
│   ├── 📁 dashboard/                # Main Dashboard
│   │   ├── 📄 page.tsx              # Dashboard UI + Role Display
│   │   └── 📄 DashboardClientLogger.tsx # Client-side Logging
│   │
│   ├── 📁 api/                      # API Routes (Server-side)
│   │   ├── 📁 auth/[...nextauth]/   # NextAuth.js API Routes
│   │   ├── 📁 documents/            # Document Management APIs
│   │   │   ├── 📄 route.ts          # List Documents (GET)
│   │   │   └── 📁 [id]/
│   │   │       └── 📄 route.ts      # Single Document (GET/PUT/DELETE)
│   │   ├── 📁 reports/              # Reports API
│   │   │   └── 📄 route.ts          # Reports API (GET/PUT/DELETE)
│   │   └── 📁 protected/            # Protected API Example
│   │       └── 📄 route.ts          # Role-protected Endpoint
│   │
│   ├── 📁 documents/                # Document Management UI
│   │   ├── 📄 page.tsx              # Document List Page
│   │   └── 📁 [id]/
│   │       └── 📄 page.tsx          # Document Detail Page
│   │
│   ├── 📁 reports/                  # Reports Testing UI
│   │   └── 📄 page.tsx              # Permission Testing Page
│   │
│   ├── 📁 admin/                    # Admin-only Pages
│   │   └── 📄 page.tsx              # Admin Dashboard
│   │
│   ├── 📁 manager/                  # Manager-only Pages
│   │   └── 📄 page.tsx              # Manager Dashboard
│   │
│   ├── 📁 client-admin/             # Client Admin Pages
│   │   └── 📄 page.tsx              # Client Admin Dashboard
│   │
│   ├── 📁 api-example/              # API Testing UI
│   │   └── 📄 page.tsx              # API Call Examples
│   │
│   └── 📁 actions/                  # Server Actions
│       └── 📄 logout.ts             # Logout Action
│
├── 📁 lib/                          # Utility Libraries
│   ├── 📄 auth-middleware.ts        # Role-based Middleware
│   ├── 📄 permissions.ts            # Permission Checker Class
│   ├── 📄 roles.ts                  # Role Utilities
│   └── 📄 mock-documents.ts         # Mock Data
│
├── 📁 types/                        # TypeScript Types
│   ├── 📄 auth.ts                   # Authentication Types
│   └── 📄 permissions.ts            # Permission Types
│
├── 📁 components/                   # Reusable Components
│   └── 📄 RoleGuard.tsx             # Role-based Rendering
│
├── 📄 auth.config.ts                # NextAuth Configuration
├── 📄 auth.ts                       # NextAuth Setup
├── 📄 middleware.ts                 # Next.js Middleware
│
└── 📁 Documentation/                # Project Documentation
    ├── 📄 PROJECT_ARCHITECTURE.md   # This file
    ├── 📄 ROLES_GUIDE.md            # Role-based Access Guide
    ├── 📄 RESOURCE_PERMISSIONS_GUIDE.md # Resource Permissions
    ├── 📄 PERMISSIONS_QUICK_START.md # Quick Setup Guide
    └── 📄 IMPLEMENTATION_SUMMARY.md  # Implementation Overview
```

---

## 🔧 Core Components

### **1. Authentication Layer**

#### **NextAuth.js Configuration**
```typescript
📄 auth.config.ts
├── Keycloak Provider Setup
├── JWT Token Decoding
├── Role Extraction (Realm + Client)
├── Session Management
└── Access Token Storage
```

#### **Authentication Files**
- `auth.config.ts` - NextAuth configuration with Keycloak
- `auth.ts` - NextAuth instance setup
- `middleware.ts` - Route protection middleware

---

### **2. Authorization Layer**

#### **Role-Based Access Control (RBAC)**
```typescript
📄 lib/auth-middleware.ts
├── requireAuth() - Basic authentication check
├── requireRoles() - Realm role validation
├── requireClientRole() - Client role validation
├── requireAdmin() - Admin-only access
└── requireManager() - Manager-only access
```

#### **Resource-Based Permissions (ABAC)**
```typescript
📄 lib/permissions.ts
├── PermissionChecker Class
├── checkResourcePermission() - UMA ticket validation
├── canView() / canEdit() / canDelete() - Scope checks
└── Keycloak Authorization API integration
```

---

### **3. UI Layer**

#### **Page Hierarchy**
```
📄 app/layout.tsx (Root Layout)
├── 📄 app/page.tsx (Landing Page)
├── 📄 app/dashboard/page.tsx (Main Dashboard)
├── 📄 app/documents/page.tsx (Document Management)
├── 📄 app/reports/page.tsx (Permission Testing)
├── 📄 app/admin/page.tsx (Admin Only)
├── 📄 app/manager/page.tsx (Manager Only)
└── 📄 app/client-admin/page.tsx (Client Admin Only)
```

#### **Component Architecture**
```typescript
📄 components/RoleGuard.tsx
├── Client-side role checking
├── Conditional rendering
└── Role-based UI protection
```

---

### **4. API Layer**

#### **Protected API Routes**
```typescript
📁 app/api/
├── 📄 documents/route.ts - Document listing with permissions
├── 📄 documents/[id]/route.ts - CRUD operations with permissions
├── 📄 reports/route.ts - Permission testing endpoints
└── 📄 protected/route.ts - Role-protected API example
```

#### **API Security Pattern**
```typescript
// Example API Route Structure
export async function GET() {
  const session = await auth();
  const permissionChecker = checkPermissions(session);
  const canView = await permissionChecker.canView("resource-name");
  
  if (!canView) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  // Return data
}
```

---

## 🔄 Data Flow

### **Authentication Flow**
```
1. User clicks "Sign in"
   ↓
2. NextAuth redirects to Keycloak
   ↓
3. User authenticates in Keycloak
   ↓
4. Keycloak returns authorization code
   ↓
5. NextAuth exchanges code for tokens
   ↓
6. JWT decoded, roles extracted
   ↓
7. Session created with user + roles + access token
   ↓
8. User redirected to dashboard
```

### **Authorization Flow (Resource-Based)**
```
1. User requests protected resource
   ↓
2. App extracts access token from session
   ↓
3. App calls Keycloak UMA endpoint
   ↓
4. Keycloak checks: User + Resource + Scope + Policies
   ↓
5. Keycloak returns permission decision
   ↓
6. App allows/denies access based on response
```

### **Authorization Flow (Role-Based)**
```
1. User requests protected page/API
   ↓
2. Middleware/API checks user roles in session
   ↓
3. Compares required roles vs user roles
   ↓
4. Allows access if roles match, denies otherwise
```

---

## 🎯 Key Integration Points

### **Keycloak Integration**
```typescript
// Configuration
Realm: my-new-realm
Client: my-app
Client Secret: AARzqXAgqpQgnXjcNtXXHZT48cppL5c1
Issuer: http://localhost:8080/realms/my-new-realm

// Endpoints Used
├── OIDC Auth: /protocol/openid-connect/auth
├── Token Exchange: /protocol/openid-connect/token
├── UMA Permissions: /protocol/openid-connect/token (UMA grant)
└── User Info: /protocol/openid-connect/userinfo
```

### **Session Structure**
```typescript
Session {
  user: {
    name: string
    email: string
    roles: {
      realm: string[]        // Realm roles
      [clientId]: string[]   // Client-specific roles
    }
  }
  accessToken: string        // For API calls to Keycloak
}
```

---

## 🛡️ Security Layers

### **1. Route Protection**
- `middleware.ts` - Protects routes at Next.js level
- Server-side session validation
- Automatic redirects for unauthenticated users

### **2. API Protection**
- Role-based middleware functions
- Resource-based permission checking
- JWT token validation

### **3. UI Protection**
- Client-side role guards
- Conditional rendering based on permissions
- Real-time permission checking

---

## 📊 Permission Models

### **Role-Based (RBAC)**
```
User → Has Roles → Can Access Resources
├── Realm Roles: admin, manager, user
└── Client Roles: client-admin, client-user
```

### **Resource-Based (ABAC)**
```
User → Has Policies → Can Perform Scopes on Resources
├── Resources: reports-api, document-1, document-2
├── Scopes: view, edit, delete
├── Policies: user-a-policy, user-c-policy
└── Permissions: Links User + Resource + Scope
```

---

## 🔌 External Dependencies

### **Core Dependencies**
- `next-auth` - Authentication framework
- `@auth/keycloak-adapter` - Keycloak integration
- `next.js` - React framework
- `tailwindcss` - Styling

### **Keycloak Server**
- **Host:** `localhost:8080`
- **Realm:** `my-new-realm`
- **Client:** `my-app`
- **Features Used:** OIDC, UMA, Authorization Services

---

## 🎛️ Configuration Files

### **Environment Variables**
```bash
# Keycloak Configuration
KEYCLOAK_CLIENT_ID=my-app
KEYCLOAK_CLIENT_SECRET=AARzqXAgqpQgnXjcNtXXHZT48cppL5c1
KEYCLOAK_ISSUER=http://localhost:8080/realms/my-new-realm

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### **Key Config Files**
- `auth.config.ts` - Authentication setup
- `middleware.ts` - Route protection
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Styling configuration

---

## 🚀 Deployment Architecture

### **Development**
```
┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │  Keycloak       │
│   localhost:3000│◄──►│  localhost:8080 │
└─────────────────┘    └─────────────────┘
```

### **Production**
```
┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │  Keycloak       │
│   your-domain   │◄──►│  auth-domain    │
└─────────────────┘    └─────────────────┘
```

---

## 📈 Scalability Considerations

### **Performance**
- Server-side session caching
- JWT token validation
- Efficient role checking
- Resource permission caching

### **Security**
- HTTPS in production
- Secure cookie settings
- Token rotation
- Session timeout management

---

## 🎯 Summary

This architecture provides:
- ✅ **Secure Authentication** - OIDC with Keycloak
- ✅ **Flexible Authorization** - RBAC + ABAC support
- ✅ **Scalable Design** - Modular component structure
- ✅ **Developer Friendly** - Clear separation of concerns
- ✅ **Production Ready** - Security best practices

The system supports both simple role-based access and complex resource-based permissions, making it suitable for enterprise applications with varying security requirements.
