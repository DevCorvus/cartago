import { NewOrderDto } from '@/shared/dtos/order.dto';

export const getCartItems = async () => {
  const res = await fetch('/api/cart');
  return res.json();
};

export const incrementCartItemAmount = async (productId: string) => {
  return fetch(`/api/cart/${productId}/amount?action=increment`, {
    method: 'PUT',
  });
};

export const decrementCartItemAmount = async (productId: string) => {
  return fetch(`/api/cart/${productId}/amount?action=decrement`, {
    method: 'PUT',
  });
};

export const removeCartItem = async (productId: string) => {
  return fetch(`/api/cart/${productId}`, {
    method: 'DELETE',
  });
};

export const checkout = async (): Promise<NewOrderDto> => {
  const res = await fetch('/api/orders', { method: 'POST' });
  return res.json();
};
