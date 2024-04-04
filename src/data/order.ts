import { CreatePaymentDto } from '@/shared/dtos/payment.dto';
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

interface CreatePaymentInterface {
  orderId: string;
  data: CreatePaymentDto;
}

export const usePayment = () => {
  return useMutation({
    mutationFn: async ({ orderId, data }: CreatePaymentInterface) => {
      const res = await fetch(`/api/orders/${orderId}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Could not create payment');
      }
    },
    mutationKey: ['payment'],
  });
};
