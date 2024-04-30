import { ProductCardDto } from '@/shared/dtos/product.dto';
import ProductItem from './ProductItem';

interface Props {
  products: ProductCardDto[];
}

export default function ProductList({ products }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
}
