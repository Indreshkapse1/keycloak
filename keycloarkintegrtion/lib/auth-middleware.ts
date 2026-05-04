import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { SessionWithRoles } from "@/types/auth";
import { checkRoles } from "@/lib/roles";

export interface RoleRequirement {
  realmRoles?: string[];
  clientRoles?: Record<string, string[]>;
  requireAll?: boolean;
}

export async function requireAuth(): Promise<
  | { session: SessionWithRoles; response: null }
  | { session: null; response: NextResponse }
> {
  const session = (await auth()) as SessionWithRoles | null;

  if (!session?.user) {
    return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  return { session, response: null };
}

export async function requireRoles(requirements: RoleRequirement): Promise<
  | { session: SessionWithRoles; response: null }
  | { session: null; response: NextResponse }
> {
  const authResult = await requireAuth();
  
  if (authResult.response) {
    return authResult;
  }

  const { session } = authResult;

  const roleChecker = checkRoles(session);
  const { realmRoles = [], clientRoles = {}, requireAll = false } = requirements;

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
    return {
      session: null,
      response: NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      ),
    };
  }

  return { session, response: null };
}

export async function requireRealmRole(role: string) {
  return requireRoles({ realmRoles: [role] });
}

export async function requireClientRole(clientId: string, role: string) {
  return requireRoles({ clientRoles: { [clientId]: [role] } });
}

export async function requireAdmin() {
  return requireRoles({ realmRoles: ["admin", "administrator"] });
}
