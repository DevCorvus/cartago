import CategoryWithProducts from '@/components/ui/CategoryWithProducts';
import CategoryList from '@/components/ui/CategoryList';
import ProductList from '@/components/ui/ProductList';
import { categoryService, productService } from '@/server/services';
import { notFound } from 'next/navigation';
import { z } from 'zod';

const paramsSchema = z.object({
  categoryId: z.number().int().positive(),
});

type SearchParams = z.infer<typeof paramsSchema>;

interface Props {
  searchParams: SearchParams;
}

export default async function ProductItems({ searchParams }: Props) {
  const categoryId = searchParams.categoryId;

  if (categoryId) {
    const result = await paramsSchema.safeParseAsync({
      categoryId: Number(categoryId),
    });

    if (!result.success) {
      notFound();
    }

    const category = await categoryService.findById(result.data.categoryId);

    if (!category) {
      notFound();
    }

    const categories = await categoryService.findAllTags();

    return (
      <div>
        <CategoryList categories={categories} skip={category.id} />
        <CategoryWithProducts category={category} />
      </div>
    );
  }

  const products = await productService.findAll();
  const categories = await categoryService.findAllTags();

  return (
    <div>
      <CategoryList categories={categories} />
      <ProductList products={products} />
    </div>
  );
}
