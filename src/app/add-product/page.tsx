import AddProductForm from '@/components/ui/AddProductForm';
import { categoryService } from '@/server/services';

export default async function AddProduct() {
  const categoryTags = await categoryService.findAllTags();

  return (
    <div className="bg-amber-50 p-5 w-full h-full flex flex-col gap-5 items-center justify-center">
      <AddProductForm defaultCategoryTags={categoryTags} />
    </div>
  );
}
