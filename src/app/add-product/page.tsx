import AddProductForm from '@/components/ui/AddProductForm';
import { categoryService } from '@/server/services';

export default async function AddProduct() {
  const categoryTags = await categoryService.findAllTags();

  return (
    <div className="flex items-center justify-center pt-20 pb-10">
      <AddProductForm defaultCategoryTags={categoryTags} />
    </div>
  );
}
