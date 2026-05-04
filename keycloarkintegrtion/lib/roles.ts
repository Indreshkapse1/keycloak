import { SessionWithRoles, UserRoles } from "@/types/auth";

export class RoleChecker {
  private roles: UserRoles;

  constructor(roles?: UserRoles) {
    this.roles = roles || { realm: [] };
  }

  hasRealmRole(role: string): boolean {
    return this.roles.realm?.includes(role) || false;
  }

  hasClientRole(clientId: string, role: string): boolean {
    return this.roles[clientId]?.includes(role) || false;
  }

  hasAnyRealmRole(roles: string[]): boolean {
    return roles.some((role) => this.hasRealmRole(role));
  }

  hasAllRealmRoles(roles: string[]): boolean {
    return roles.every((role) => this.hasRealmRole(role));
  }

  hasAnyClientRole(clientId: string, roles: string[]): boolean {
    return roles.some((role) => this.hasClientRole(clientId, role));
  }

  hasAllClientRoles(clientId: string, roles: string[]): boolean {
    return roles.every((role) => this.hasClientRole(clientId, role));
  }

  hasAnyRole(realmRoles: string[] = [], clientRoles: Record<string, string[]> = {}): boolean {
    const hasRealmRole = realmRoles.length > 0 && this.hasAnyRealmRole(realmRoles);
    
    const hasClientRole = Object.entries(clientRoles).some(([clientId, roles]) =>
      this.hasAnyClientRole(clientId, roles)
    );

    return hasRealmRole || hasClientRole;
  }

  getAllRealmRoles(): string[] {
    return this.roles.realm || [];
  }

  getClientRoles(clientId: string): string[] {
    return this.roles[clientId] || [];
  }

  getAllRoles(): UserRoles {
    return this.roles;
  }

  isAdmin(): boolean {
    return this.hasRealmRole("admin") || this.hasRealmRole("administrator");
  }

  isUser(): boolean {
    return this.hasRealmRole("user");
  }
}

export function checkRoles(session: SessionWithRoles | null): RoleChecker {
  return new RoleChecker(session?.user?.roles);
}

export function hasRealmRole(session: SessionWithRoles | null, role: string): boolean {
  return checkRoles(session).hasRealmRole(role);
}

export function hasClientRole(
  session: SessionWithRoles | null,
  clientId: string,
  role: string
): boolean {
  return checkRoles(session).hasClientRole(clientId, role);
}

export function hasAnyRealmRole(session: SessionWithRoles | null, roles: string[]): boolean {
  return checkRoles(session).hasAnyRealmRole(roles);
}

export function hasAllRealmRoles(session: SessionWithRoles | null, roles: string[]): boolean {
  return checkRoles(session).hasAllRealmRoles(roles);
}

export function isAdmin(session: SessionWithRoles | null): boolean {
  return checkRoles(session).isAdmin();
}

export function isUser(session: SessionWithRoles | null): boolean {
  return checkRoles(session).isUser();
}
