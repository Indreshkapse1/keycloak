export type ResourceType = "document" | "report" | "file";

export type Permission = "view" | "edit" | "delete" | "share" | "download";

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  owner?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ResourcePermission {
  resourceId: string;
  resourceName: string;
  scopes: Permission[];
}

export interface PermissionCheckResult {
  allowed: boolean;
  resource?: string;
  scope?: Permission;
  reason?: string;
}

export interface UserPermissions {
  resources: ResourcePermission[];
}
