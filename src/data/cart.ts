import { NewOrderDto } from '@/shared/dtos/order.dto';
import { ProductCartItemDto } from '@/shared/dtos/product.dto';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useCartItems = (authenticated: boolean) => {
  return useQuery<ProductCartItemDto[]>({
    queryFn: async () => {
      const res = await fetch('/api/cart');

      if (!res.ok) {
        throw new Error('Coult not get cart items');
      }

      return res.json();
    },
    queryKey: ['cartItems'],
    enabled: authenticated,
  });
};

export const useIncrementCartItemAmount = () => {
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(
        `/api/cart/${productId}/amount?action=increment`,
        {
          method: 'PUT',
        },
      );

      if (!res.ok) {
        throw new Error('Coult not increment cart item amount');
      }
    },
    mutationKey: ['incrementCartItemAmount'],
  });
};

export const useDecrementCartItemAmount = () => {
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(
        `/api/cart/${productId}/amount?action=decrement`,
        {
          method: 'PUT',
        },
      );

      if (!res.ok) {
        throw new Error('Coult not decrement cart item amount');
      }
    },
    mutationKey: ['decrementCartItemAmount'],
  });
};

export const useRemoveCartItem = () => {
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Coult not remove cart item');
      }
    },
    mutationKey: ['removeCartItem'],
  });
};

export const useCheckout = () => {
  return useMutation({
    mutationFn: async (): Promise<NewOrderDto> => {
      const res = await fetch('/api/orders', { method: 'POST' });

      if (!res.ok) {
        throw new Error('Coult not checkout cart items');
      }

      return res.json();
    },
    mutationKey: ['checkout'],
  });
};
