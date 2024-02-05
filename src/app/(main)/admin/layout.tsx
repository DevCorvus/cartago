import { checkUserPermissions, getUserSession } from '@/server/auth/auth.utils';
import { Permissions } from '@/server/auth/rbac';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserSession();

  if (!user) {
    redirect('/login');
  }

  const hasPermission = await checkUserPermissions(
    [Permissions.VIEW_ADMIN_PANEL],
    user.role,
  );

  if (!hasPermission) {
    redirect('/');
  }

  return <>{children}</>;
}
