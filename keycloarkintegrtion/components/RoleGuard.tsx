"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { SessionWithRoles } from "@/types/auth";
import { checkRoles } from "@/lib/roles";

interface RoleGuardProps {
  children: ReactNode;
  realmRoles?: string[];
  clientRoles?: Record<string, string[]>;
  requireAll?: boolean;
  fallback?: ReactNode;
}

export function RoleGuard({
  children,
  realmRoles = [],
  clientRoles = {},
  requireAll = false,
  fallback = null,
}: RoleGuardProps) {
  const { data: session } = useSession();
  const roleChecker = checkRoles(session as SessionWithRoles | null);

  let hasAccess = false;

  if (requireAll) {
    const hasAllRealmRoles = realmRoles.length === 0 || roleChecker.hasAllRealmRoles(realmRoles);
    const hasAllClientRoles = Object.entries(clientRoles).every(([clientId, roles]) =>
      roleChecker.hasAllClientRoles(clientId, roles)
    );
    hasAccess = hasAllRealmRoles && hasAllClientRoles;
  } else {
    hasAccess = roleChecker.hasAnyRole(realmRoles, clientRoles);
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface RealmRoleGuardProps {
  children: ReactNode;
  role: string;
  fallback?: ReactNode;
}

export function RealmRoleGuard({ children, role, fallback = null }: RealmRoleGuardProps) {
  return (
    <RoleGuard realmRoles={[role]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

interface ClientRoleGuardProps {
  children: ReactNode;
  clientId: string;
  role: string;
  fallback?: ReactNode;
}

export function ClientRoleGuard({
  children,
  clientId,
  role,
  fallback = null,
}: ClientRoleGuardProps) {
  return (
    <RoleGuard clientRoles={{ [clientId]: [role] }} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AdminGuard({ children, fallback = null }: AdminGuardProps) {
  return (
    <RoleGuard realmRoles={["admin", "administrator"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}
