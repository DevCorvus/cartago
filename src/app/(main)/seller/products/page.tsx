import SellerProductList from '@/components/ui/SellerProductList';
import { checkUserPermissions, getUserSession } from '@/server/auth/auth.utils';
import { Permissions } from '@/shared/auth/rbac';
import { redirect } from 'next/navigation';

export default async function SellerProducts() {
  const user = await getUserSession();

  if (!user) {
    redirect('/login');
  }

  const hasPermissions = await checkUserPermissions(
    [Permissions.VIEW_SELLER_PANEL],
    user.role,
  );

  if (!hasPermissions) {
    redirect('/');
  }

  return <SellerProductList />;
}
