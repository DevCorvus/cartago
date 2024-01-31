import AddProductForm from '@/components/ui/AddProductForm';
import { checkUserPermissions, getUserSession } from '@/server/auth/auth.utils';
import { Permissions } from '@/server/auth/rbac';
import { categoryService } from '@/server/services';
import { redirect } from 'next/navigation';

export default async function AddProduct() {
  const user = await getUserSession();

  if (!user) {
    redirect('/sign-in');
  }

  const hasPermissions = await checkUserPermissions(
    [Permissions.CREATE_PRODUCT],
    user.role,
  );

  if (!hasPermissions) {
    redirect('/');
  }

  const categoryTags = await categoryService.findAllTags();

  return (
    <div className="flex items-center justify-center pt-20 pb-10">
      <AddProductForm defaultCategoryTags={categoryTags} />
    </div>
  );
}
