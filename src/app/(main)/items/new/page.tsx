import AddProductForm from '@/components/ui/AddProductForm';
import { Permissions } from '@/server/auth/rbac';
import withAuth from '@/server/middlewares/withAuth';
import { categoryService } from '@/server/services';

async function AddProduct() {
  const categoryTags = await categoryService.findAllTags();
  return <AddProductForm categoryTags={categoryTags} />;
}

export default withAuth(AddProduct, [Permissions.CREATE_PRODUCT]);
