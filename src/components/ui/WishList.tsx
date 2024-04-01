'use client';

import { ProductCardWithSalesDto } from '@/shared/dtos/product.dto';
import ProductList from './ProductList';
import { localStorageWished } from '@/utils/localStorageWished';

interface Props {
  products: ProductCardWithSalesDto[] | null;
}

export default function WishList({ products }: Props) {
  if (products) {
    return <ProductList products={products} />;
  } else {
    return <ProductList products={localStorageWished.get()} />;
  }
}
