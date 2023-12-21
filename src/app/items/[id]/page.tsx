import ProductItemDetails from '@/components/ui/ProductItemDetails';
import { productService } from '@/server/services';
import { notFound } from 'next/navigation';
import { paramsSchema } from '@/shared/schemas/params.schema';
import { Params } from '@/shared/dtos/params.dto';

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
