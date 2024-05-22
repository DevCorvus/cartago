import { ProductCardDto } from '@/shared/dtos/product.dto';
import ProductRelatedItem from './ProductRelatedItem';

interface Props {
  products: ProductCardDto[];
}

export default function ProductRelatedList({ products }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {products.map((product) => (
        <ProductRelatedItem key={product.id} product={product} />
      ))}
    </div>
  );
}
