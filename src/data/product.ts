import { ProductCardWithSalesDto } from '@/shared/dtos/product.dto';

export const getProducts = async (
  lastId?: string,
): Promise<ProductCardWithSalesDto[]> => {
  let url = '/api/products';

  if (lastId) {
    const searchParams = new URLSearchParams();
    searchParams.append('lastId', lastId);
    url += '?' + searchParams.toString();
  }

  const res = await fetch(url);
  return res.json();
};
