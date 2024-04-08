import { PRODUCT_PAGE_SIZE } from '@/shared/constants';
import { ProductCardWithSalesDto, ProductDto } from '@/shared/dtos/product.dto';
import { localStorageWished } from '@/utils/localStorageWished';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

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

export const useGuestWishedProducts = (unauthenticated: boolean) => {
  return useQuery({
    queryFn: async (): Promise<ProductCardWithSalesDto[]> => {
      const wishedItemIds = localStorageWished.get();

      const searchParams = new URLSearchParams();
      searchParams.append('items', JSON.stringify(wishedItemIds));

      const res = await fetch(
        '/api/products/wished/guest?' + searchParams.toString(),
      );

      if (!res.ok) {
        throw new Error('Could not get guest wished products');
      }

      return res.json();
    },
    queryKey: ['guestWishedProducts'],
    enabled: unauthenticated,
    gcTime: 0,
  });
};

export const useProductCards = () => {
  return useQuery({
    queryFn: async (): Promise<ProductCardWithSalesDto[]> => {
      const res = await fetch('/api/seller/products');

      if (!res.ok) {
        throw new Error('Could not get product cards');
      }

      return res.json();
    },
    queryKey: ['productCards'],
  });
};

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: async (formData: FormData): Promise<ProductDto> => {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Could not create product');
      }

      return res.json();
    },
    mutationKey: ['createProduct'],
  });
};

interface UpdateProductInterface {
  productId: string;
  formData: FormData;
}

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: async ({
      productId,
      formData,
    }: UpdateProductInterface): Promise<ProductDto> => {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Could not update product');
      }

      return res.json();
    },
    mutationKey: ['updateProduct'],
  });
};

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Could not delete product');
      }
    },
    mutationKey: ['deleteProduct'],
  });
};
