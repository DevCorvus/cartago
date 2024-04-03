import { ProductCardWithSalesDto } from '@/shared/dtos/product.dto';

interface GetProductsOptions {
  lastId?: string;
  categoryId?: number;
}

export const getProducts = async (
  options: GetProductsOptions,
): Promise<ProductCardWithSalesDto[]> => {
  let url = '/api/products';

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(options)) {
    if (value) {
      searchParams.append(key, value);
    }
  }

  if (searchParams.size > 0) {
    url += '?' + searchParams.toString();
  }

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Could not get products');
  }

  return res.json();
};

export const getWishedProducts = async (): Promise<
  ProductCardWithSalesDto[]
> => {
  const res = await fetch('/api/products/wished');

  if (!res.ok) {
    throw new Error('Could not get wished products');
  }

  return res.json();
};
