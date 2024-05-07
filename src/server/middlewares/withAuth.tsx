import { checkUserPermissions, getUserSession } from '@/server/auth/auth.utils';
import { PermissionType } from '@/shared/auth/rbac';
import { redirect } from 'next/navigation';
import { UserSession } from '@/shared/auth/auth.types';

interface WithAuthProps {
  user: UserSession;
  children: React.ReactNode;
  params: any;
}

type WithAuthComponent = React.FC<WithAuthProps>;

export default function withAuth(
  Component: WithAuthComponent,
  permissions?: PermissionType[],
) {
  return async function WithAuth(props: WithAuthProps) {
    const user = await getUserSession();

    if (!user) {
      redirect('/login');
    }

    if (permissions) {
      const hasPermissions = await checkUserPermissions(permissions, user.role);

      if (!hasPermissions) {
        redirect('/');
      }
    }

    return <Component {...props} user={user} />;
  };
}
