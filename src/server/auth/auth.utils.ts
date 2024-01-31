import { getServerSession } from 'next-auth';
import { nextAuthOptions } from './next-auth.config';
import { PermissionType, RolePermissions, RoleType } from './rbac';

export async function getUserSession() {
  const session = await getServerSession(nextAuthOptions);
  return session ? session.user : null;
}

function hasPermissions(role: RoleType, permissions: PermissionType[]) {
  return permissions.every((permission) =>
    RolePermissions[role].has(permission),
  );
}

export async function checkUserPermissions(
  permissions: PermissionType[],
  role?: RoleType,
): Promise<boolean> {
  if (role) {
    return hasPermissions(role, permissions);
  } else {
    const user = await getUserSession();

    if (user) {
      return hasPermissions(user.role, permissions);
    } else {
      return false;
    }
  }
}
