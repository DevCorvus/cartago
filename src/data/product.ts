import { PRODUCT_PAGE_SIZE } from '@/shared/constants';
import { ProductCardWithSalesDto } from '@/shared/dtos/product.dto';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

interface GetProductsOptions {
  lastId?: string;
  categoryId?: number;
}

const getProducts = async (
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

export const useProducts = (categoryId?: number) => {
  return useInfiniteQuery<ProductCardWithSalesDto[]>({
    initialPageParam: undefined,
    queryFn: async ({ pageParam }) => {
      return getProducts({
        lastId: pageParam as string | undefined,
        categoryId,
      });
    },
    queryKey: ['products'],
    getNextPageParam: (products) => {
      if (products.length !== PRODUCT_PAGE_SIZE) return;
      else return products[products.length - 1].id;
    },
  });
};

export const useWishedProducts = (authenticated: boolean) => {
  return useQuery({
    queryFn: async (): Promise<ProductCardWithSalesDto[]> => {
      const res = await fetch('/api/products/wished');

      if (!res.ok) {
        throw new Error('Could not get wished products');
      }

      return res.json();
    },
    queryKey: ['wishedProducts'],
    enabled: authenticated,
  });
};
