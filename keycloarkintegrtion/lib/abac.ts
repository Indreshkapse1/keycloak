/**
 * Attribute-Based Access Control (ABAC)
 * 
 * Users have custom attributes that determine their access level:
 * - ram: role = "admin" (Full access)
 * - alice: role = "projectmanager" (Can see all projects)
 * - bob: role = "lead" (Can see all resources)
 */

import { SessionWithRoles } from "@/types/auth";

export type UserRole = "admin" | "projectmanager" | "lead";

export interface UserAttributes {
  role: UserRole;
  username: string;
  email: string;
}

export interface AccessDecision {
  allowed: boolean;
  reason?: string;
}

/**
 * Extract user attributes from session
 */
export function extractUserAttributes(session: SessionWithRoles | null): UserAttributes | null {
  if (!session?.user) {
    return null;
  }

  const user = session.user as any;
  
  // Try to get role from custom attribute first
  let role = user.role;
  
  // If not found, try to extract from roles array (realm roles)
  if (!role && user.roles) {
    const realmRoles = user.roles.realm || [];
    // Check if user has admin, projectmanager, or lead role
    if (realmRoles.includes("admin")) {
      role = "admin";
    } else if (realmRoles.includes("projectmanager")) {
      role = "projectmanager";
    } else if (realmRoles.includes("lead")) {
      role = "lead";
    }
  }
  
  // Default to lead if no role found
  if (!role) {
    role = "lead";
  }

  return {
    role: role as UserRole,
    username: user.name || user.email || "unknown",
    email: user.email || "unknown",
  };
}

/**
 * Check if user has a specific role
 */
export function hasRole(session: SessionWithRoles | null, requiredRole: UserRole): boolean {
  const attributes = extractUserAttributes(session);
  return attributes?.role === requiredRole;
}

/**
 * Check if user is admin
 */
export function isAdmin(session: SessionWithRoles | null): boolean {
  return hasRole(session, "admin");
}

/**
 * Check if user is project manager
 */
export function isProjectManager(session: SessionWithRoles | null): boolean {
  return hasRole(session, "projectmanager");
}

/**
 * Check if user is lead
 */
export function isLead(session: SessionWithRoles | null): boolean {
  return hasRole(session, "lead");
}

/**
 * Get user's access level
 */
export function getUserAccessLevel(session: SessionWithRoles | null): string {
  const attributes = extractUserAttributes(session);
  if (!attributes) return "none";

  switch (attributes.role) {
    case "admin":
      return "Admin";
    case "projectmanager":
      return "ProjectManager";
    case "lead":
      return "Lead";
    default:
      return "None";
  }
}

/**
 * Check if user can view projects
 */
export function canViewProjects(session: SessionWithRoles | null): boolean {
  const attributes = extractUserAttributes(session);
  if (!attributes) return false;

  // Admin and ProjectManager can view projects
  return attributes.role === "admin" || attributes.role === "projectmanager";
}

/**
 * Check if user can view resources
 */
export function canViewResources(session: SessionWithRoles | null): boolean {
  const attributes = extractUserAttributes(session);
  if (!attributes) return false;

  // Admin and Lead can view resources
  return attributes.role === "admin" || attributes.role === "lead";
}

/**
 * Check if user can create projects
 */
export function canCreateProject(session: SessionWithRoles | null): boolean {
  const attributes = extractUserAttributes(session);
  if (!attributes) return false;

  // Only Admin and ProjectManager can create projects
  return attributes.role === "admin" || attributes.role === "projectmanager";
}

/**
 * Check if user can edit projects
 */
export function canEditProject(session: SessionWithRoles | null): boolean {
  const attributes = extractUserAttributes(session);
  if (!attributes) return false;

  // Only Admin and ProjectManager can edit projects
  return attributes.role === "admin" || attributes.role === "projectmanager";
}

/**
 * Check if user can delete projects
 */
export function canDeleteProject(session: SessionWithRoles | null): boolean {
  const attributes = extractUserAttributes(session);
  if (!attributes) return false;

  // Only Admin can delete projects
  return attributes.role === "admin";
}

/**
 * Check if user can create resources
 */
export function canCreateResource(session: SessionWithRoles | null): boolean {
  const attributes = extractUserAttributes(session);
  if (!attributes) return false;

  // Admin and Lead can create resources
  return attributes.role === "admin" || attributes.role === "lead";
}

/**
 * Check if user can edit resources
 */
export function canEditResource(session: SessionWithRoles | null): boolean {
  const attributes = extractUserAttributes(session);
  if (!attributes) return false;

  // Admin and Lead can edit resources
  return attributes.role === "admin" || attributes.role === "lead";
}

/**
 * Check if user can delete resources
 */
export function canDeleteResource(session: SessionWithRoles | null): boolean {
  const attributes = extractUserAttributes(session);
  if (!attributes) return false;

  // Only Admin can delete resources
  return attributes.role === "admin";
}

/**
 * Get available actions for user on projects
 */
export function getProjectActions(session: SessionWithRoles | null): string[] {
  const actions: string[] = [];

  if (canViewProjects(session)) {
    actions.push("view");
  }
  if (canCreateProject(session)) {
    actions.push("create");
  }
  if (canEditProject(session)) {
    actions.push("edit");
  }
  if (canDeleteProject(session)) {
    actions.push("delete");
  }

  return actions;
}

/**
 * Get available actions for user on resources
 */
export function getResourceActions(session: SessionWithRoles | null): string[] {
  const actions: string[] = [];

  if (canViewResources(session)) {
    actions.push("view");
  }
  if (canCreateResource(session)) {
    actions.push("create");
  }
  if (canEditResource(session)) {
    actions.push("edit");
  }
  if (canDeleteResource(session)) {
    actions.push("delete");
  }

  return actions;
}

/**
 * Check if user can perform action on resource type
 */
export function canPerformAction(
  session: SessionWithRoles | null,
  action: "view" | "create" | "edit" | "delete",
  resourceType: "project" | "resource"
): AccessDecision {
  const attributes = extractUserAttributes(session);

  if (!attributes) {
    return {
      allowed: false,
      reason: "User not authenticated",
    };
  }

  let allowed = false;

  if (resourceType === "project") {
    switch (action) {
      case "view":
        allowed = canViewProjects(session);
        break;
      case "create":
        allowed = canCreateProject(session);
        break;
      case "edit":
        allowed = canEditProject(session);
        break;
      case "delete":
        allowed = canDeleteProject(session);
        break;
    }
  } else if (resourceType === "resource") {
    switch (action) {
      case "view":
        allowed = canViewResources(session);
        break;
      case "create":
        allowed = canCreateResource(session);
        break;
      case "edit":
        allowed = canEditResource(session);
        break;
      case "delete":
        allowed = canDeleteResource(session);
        break;
    }
  }

  return {
    allowed,
    reason: allowed ? undefined : `Role '${attributes.role}' cannot ${action} ${resourceType}`,
  };
}
