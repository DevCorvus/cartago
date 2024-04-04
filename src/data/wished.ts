import { useMutation } from '@tanstack/react-query';

export const useWishProduct = () => {
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(`/api/wished/${productId}`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Could not wish product');
      }
    },
    mutationKey: ['wish'],
  });
};

export const useUnwishProduct = () => {
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(`/api/wished/${productId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Could not unwish product');
      }
    },
    mutationKey: ['unwish'],
  });
};
