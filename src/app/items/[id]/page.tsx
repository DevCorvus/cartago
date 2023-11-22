import ProductItemDetails from '@/components/ui/ProductItemDetails';
import { productService } from '@/server/services';
import { notFound } from 'next/navigation';
import { z } from 'zod';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

type Params = z.infer<typeof paramsSchema>;

interface Props {
  params: Params;
}

export default async function ProductItem({ params }: Props) {
  const result = await paramsSchema.safeParseAsync(params);

  if (!result.success) {
    notFound();
  }

  const product = await productService.findById(result.data.id);

  if (!product) {
    notFound();
  }

  return <ProductItemDetails product={product} />;
}
