import AddProductForm from '@/components/ui/AddProductForm';
import { categoryService } from '@/server/services';

export default async function AddProduct() {
  const categoryTags = await categoryService.findAllTags();

  return <AddProductForm categoryTags={categoryTags} />;
}
