import { getServerSession } from 'next-auth';
import { nextAuthOptions } from './next-auth.config';
import { PermissionType, RoleType } from '@/shared/auth/rbac';
import { hasPermissions } from '@/shared/auth/auth.utils';

export async function getUserSession() {
  const session = await getServerSession(nextAuthOptions);
  return session ? session.user : null;
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
