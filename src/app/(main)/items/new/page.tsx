import AddProductForm from '@/components/ui/AddProductForm';
import { Permissions } from '@/shared/auth/rbac';
import { categoryService } from '@/server/services';
import { checkUserPermissions, getUserSession } from '@/server/auth/auth.utils';
import { redirect } from 'next/navigation';

export default async function AddProduct() {
  const user = await getUserSession();

  if (!user) {
    redirect('/login');
  }

  const hasPermissions = await checkUserPermissions(
    [Permissions.CREATE_PRODUCT],
    user.role,
  );

  if (!hasPermissions) {
    redirect('/');
  }

  const categoryTags = await categoryService.findAllTags();
  return <AddProductForm categoryTags={categoryTags} />;
}
