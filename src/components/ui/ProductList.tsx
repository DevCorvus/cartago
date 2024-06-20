import { ProductCardDto } from '@/shared/dtos/product.dto';
import ProductItem from './ProductItem';
import SkeletonProductItem from './SkeletonProductItem';
import { PRODUCT_PAGE_SIZE } from '@/shared/constants';

interface Props {
  isLoading?: boolean;
  products: ProductCardDto[];
}

export default function ProductList({ isLoading, products }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
      {isLoading &&
        Array(PRODUCT_PAGE_SIZE)
          .fill(null)
          .map((_, i) => <SkeletonProductItem key={i + '-skeleton'} />)}
    </div>
  );
}
