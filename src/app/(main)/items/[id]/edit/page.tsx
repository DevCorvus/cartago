import EditProductForm from '@/components/ui/EditProductForm';
import { UserSession } from '@/server/auth/auth.types';
import { Permissions } from '@/server/auth/rbac';
import withAuth from '@/server/middlewares/withAuth';
import { categoryService, productService } from '@/server/services';
import { Params } from '@/shared/dtos/params.dto';
import { paramsSchema } from '@/shared/schemas/params.schema';
import { notFound } from 'next/navigation';

interface Props {
  params: Params;
  user: UserSession;
}

async function EditProduct({ user, params }: Props) {
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

export default withAuth(EditProduct, [Permissions.EDIT_PRODUCT]);
