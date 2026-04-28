# Keycloak Setup Instructions

## Current Configuration
- **Keycloak URL**: http://localhost:8080
- **Realm**: myrealm
- **Client ID**: myclient
- **Client Type**: Public

## Required Redirect URIs in Keycloak

You need to add the following redirect URIs in your Keycloak client settings:

1. `http://localhost:3000/api/auth/callback/keycloak`
2. `http://localhost:3000/*`
3. `http://localhost:3000/`

## Steps to Update Keycloak Client

1. Go to Keycloak Admin Console: http://localhost:8080
2. Navigate to: **Clients** → **myclient**
3. In the **Valid redirect URIs** section, ensure you have:
   - `http://localhost:3000/api/auth/callback/keycloak` (most important)
   - `http://localhost:3000/*`
   - `http://localhost:3000/`
4. In the **Valid post logout redirect URIs** section, add:
   - `http://localhost:3000/*`
5. In the **Web origins** section, ensure you have:
   - `http://localhost:3000`
6. Click **Save**

## User Setup in Keycloak

Make sure you have at least one user created in the `myrealm` realm:

1. Go to **Users** in Keycloak Admin Console
2. Click **Add user** or select an existing user
3. Ensure the user has:
   - Username set
   - Email set (optional but recommended)
   - Email verified (optional)
4. Go to **Credentials** tab and set a password
5. Disable **Temporary** password option if you want a permanent password

## Testing the Integration

1. Start your Next.js app: `npm run dev`
2. Visit: http://localhost:3000
3. Click "Sign In with Keycloak"
4. You'll be redirected to Keycloak login page
5. Enter your username and password
6. After successful login, you'll be redirected to the dashboard
7. The dashboard will display your username and email

## Environment Variables (Optional)

If you want to use environment variables instead of hardcoded values, create a `.env.local` file:

```env
AUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32
AUTH_KEYCLOAK_ID=myclient
AUTH_KEYCLOAK_ISSUER=http://localhost:8080/realms/myrealm
```

Then update `auth.config.ts` to use these variables:
```typescript
clientId: process.env.AUTH_KEYCLOAK_ID,
issuer: process.env.AUTH_KEYCLOAK_ISSUER,
```

And update `auth.ts`:
```typescript
secret: process.env.AUTH_SECRET,
```

## Troubleshooting

### Issue: "Invalid redirect_uri"
- Make sure `http://localhost:3000/api/auth/callback/keycloak` is added to Valid redirect URIs in Keycloak

### Issue: "User not found" or login fails
- Check that the user exists in the `myrealm` realm
- Verify the user has a password set
- Make sure the user is enabled

### Issue: Email or username not showing
- Check that the user has these fields populated in Keycloak
- Verify the client scopes include `profile` and `email`
