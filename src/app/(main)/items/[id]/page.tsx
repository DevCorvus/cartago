import { productService } from '@/server/services';
import { notFound } from 'next/navigation';
import { paramsSchema } from '@/shared/schemas/params.schema';
import { Params } from '@/shared/dtos/params.dto';
import { getUserSession } from '@/server/auth/auth.utils';
import ProductDetails from '@/components/ui/ProductDetails';

interface Props {
  params: Params;
}

export default async function ProductItem({ params }: Props) {
  const result = await paramsSchema.safeParseAsync(params);

  if (!result.success) {
    notFound();
  }

  const user = await getUserSession();

  const productWithRelatedOnes = await productService.findByIdWithRelatedOnes(
    result.data.id,
    user?.id,
  );

  if (!productWithRelatedOnes) {
    notFound();
  }

  return <ProductDetails {...productWithRelatedOnes} />;
}
