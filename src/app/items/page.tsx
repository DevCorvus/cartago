import CategoryItemWithProducts from '@/components/ui/CategoryItemWithProducts';
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

    const categoryWithProducts = await categoryService.findByIdWithProducts(
      result.data.categoryId,
    );

    if (!categoryWithProducts) {
      notFound();
    }

    return (
      <CategoryItemWithProducts categoryWithProducts={categoryWithProducts} />
    );
  }

  const products = await productService.findAll();
  return <ProductList products={products} />;
}
