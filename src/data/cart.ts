import { NewCheckoutOrderDto } from '@/shared/dtos/order.dto';
import {
  ProductCartItemDto,
  ProductCartItemWithoutAmountDto,
} from '@/shared/dtos/product.dto';
import { localStorageCart } from '@/utils/localStorageCart';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useCartItems = () => {
  return useQuery<ProductCartItemDto[]>({
    queryFn: async () => {
      const res = await fetch('/api/cart');

      if (!res.ok) {
        throw new Error('Could not get cart items');
      }

      return res.json();
    },
    queryKey: ['cartItems'],
    gcTime: 0,
  });
};

export const useGuestCartItems = () => {
  return useQuery<ProductCartItemWithoutAmountDto[]>({
    queryFn: async () => {
      const cartItemIds = localStorageCart.get().map((item) => item.id);

      const searchParams = new URLSearchParams();
      searchParams.append('items', JSON.stringify(cartItemIds));

      const res = await fetch('/api/cart/guest?' + searchParams.toString());

      if (!res.ok) {
        throw new Error('Could not get guest cart items');
      }

      return res.json();
    },
    queryKey: ['guestCartItems'],
    gcTime: 0,
  });
};

export const useAddCartItem = () => {
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(`/api/cart/${productId}`, { method: 'POST' });

      if (!res.ok) {
        throw new Error('Could not add product to shopping cart');
      }
    },
    mutationKey: ['addCartItem'],
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
        throw new Error('Could not increment cart item amount');
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
        throw new Error('Could not decrement cart item amount');
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
        throw new Error('Could not remove cart item');
      }
    },
    mutationKey: ['removeCartItem'],
  });
};

export const useSyncCartItemAmounts = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/cart/sync', { method: 'PUT' });

      if (!res.ok) {
        throw new Error('Could not sync cart item amounts');
      }
    },
    mutationKey: ['syncCartItemAmounts'],
  });
};

export const useCheckout = () => {
  return useMutation({
    mutationFn: async (): Promise<NewCheckoutOrderDto> => {
      const res = await fetch('/api/orders', { method: 'POST' });

      if (!res.ok) {
        throw new Error('Could not checkout cart items');
      }

      return res.json();
    },
    mutationKey: ['checkout'],
  });
};
