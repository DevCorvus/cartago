import { PermissionType, RolePermissions, RoleType } from './rbac';

export function hasPermissions(role: RoleType, permissions: PermissionType[]) {
  return permissions.every((permission) =>
    RolePermissions[role].has(permission),
  );
}
