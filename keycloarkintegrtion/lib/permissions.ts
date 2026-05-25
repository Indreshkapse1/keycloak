import { SessionWithRoles } from "@/types/auth";
import { Permission, PermissionCheckResult } from "@/types/permissions";

export class PermissionChecker {
  private accessToken: string | null;

  constructor(session: SessionWithRoles | null) {
    this.accessToken = (session as any)?.accessToken || null;
  }

  async checkResourcePermission(
    resourceName: string,
    scope: Permission
  ): Promise<PermissionCheckResult> {
    if (!this.accessToken) {
      return {
        allowed: false,
        resource: resourceName,
        scope,
        reason: "No access token available",
      };
    }

    try {
      const response = await fetch(
        `http://localhost:8080/realms/my-new-realm/protocol/openid-connect/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:uma-ticket",
            audience: "my-app",
            permission: `${resourceName}#${scope}`,
            subject_token: this.accessToken,
          }),
        }
      );

      if (response.ok) {
        return {
          allowed: true,
          resource: resourceName,
          scope,
        };
      } else {
        const error = await response.json();
        return {
          allowed: false,
          resource: resourceName,
          scope,
          reason: error.error_description || "Permission denied",
        };
      }
    } catch (error) {
      console.error("[PERMISSIONS] Error checking permission:", error);
      return {
        allowed: false,
        resource: resourceName,
        scope,
        reason: "Error checking permission",
      };
    }
  }

  async checkMultiplePermissions(
    resourceName: string,
    scopes: Permission[]
  ): Promise<Record<Permission, boolean>> {
    const results: Record<string, boolean> = {};

    for (const scope of scopes) {
      const result = await this.checkResourcePermission(resourceName, scope);
      results[scope] = result.allowed;
    }

    return results as Record<Permission, boolean>;
  }

  async canView(resourceName: string): Promise<boolean> {
    const result = await this.checkResourcePermission(resourceName, "view");
    return result.allowed;
  }

  async canEdit(resourceName: string): Promise<boolean> {
    const result = await this.checkResourcePermission(resourceName, "edit");
    return result.allowed;
  }

  async canDelete(resourceName: string): Promise<boolean> {
    const result = await this.checkResourcePermission(resourceName, "delete");
    return result.allowed;
  }
}

export function checkPermissions(session: SessionWithRoles | null): PermissionChecker {
  return new PermissionChecker(session);
}

export async function requireResourcePermission(
  session: SessionWithRoles | null,
  resourceName: string,
  scope: Permission
): Promise<PermissionCheckResult> {
  const checker = new PermissionChecker(session);
  return await checker.checkResourcePermission(resourceName, scope);
}
