import { checkUserPermissions, getUserSession } from '@/server/auth/auth.utils';
import { Permissions } from '@/shared/auth/rbac';
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

  const hasPermissions = await checkUserPermissions(
    [Permissions.VIEW_ADMIN_PANEL],
    user.role,
  );

  if (!hasPermissions) {
    redirect('/');
  }

  return <>{children}</>;
}
