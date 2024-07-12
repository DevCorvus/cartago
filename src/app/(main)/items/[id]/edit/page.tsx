import EditProductForm from '@/components/ui/EditProductForm';
import { Permissions } from '@/shared/auth/rbac';
import { categoryService, productService } from '@/server/services';
import { Params } from '@/shared/dtos/params.dto';
import { paramsSchema } from '@/shared/schemas/params.schema';
import { notFound, redirect } from 'next/navigation';
import { checkUserPermissions, getUserSession } from '@/server/auth/auth.utils';

interface Props {
  params: Params;
}

export default async function EditProduct({ params }: Props) {
  const user = await getUserSession();

  if (!user) {
    redirect('/login');
  }

  const hasPermissions = await checkUserPermissions(
    [Permissions.EDIT_PRODUCT],
    user.role,
  );

  if (!hasPermissions) {
    redirect('/');
  }

  const result = await paramsSchema.safeParseAsync(params);

  if (!result.success) {
    notFound();
  }

  const product = await productService.findById(result.data.id, user.id);

  if (!product) {
    notFound();
  }

  const categoryTags = await categoryService.findAllTags();
  return <EditProductForm product={product} categoryTags={categoryTags} />;
}
