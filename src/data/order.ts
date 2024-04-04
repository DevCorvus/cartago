import { useMutation } from '@tanstack/react-query';

export const useConfirmDelivery = () => {
  return useMutation({
    mutationFn: async (orderId: string) => {
      const res = await fetch(`/api/orders/${orderId}/confirm-delivery`, {
        method: 'PUT',
      });

      if (!res.ok) {
        throw new Error('Could not confirm delivery');
      }
    },
    mutationKey: ['confirmDelivery'],
  });
};
