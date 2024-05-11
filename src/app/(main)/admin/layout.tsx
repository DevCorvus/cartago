import { Permissions } from '@/shared/auth/rbac';
import withAuth from '@/server/middlewares/withAuth';

async function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withAuth(AdminLayout, [Permissions.VIEW_ADMIN_PANEL]);
