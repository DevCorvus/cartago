import { NewOrderDto } from '@/shared/dtos/order.dto';

export const getCartItems = async () => {
  const res = await fetch('/api/cart');

  if (!res.ok) {
    throw new Error('Coult not get cart items');
  }

  return res.json();
};

export const incrementCartItemAmount = async (productId: string) => {
  const res = await fetch(`/api/cart/${productId}/amount?action=increment`, {
    method: 'PUT',
  });

  if (!res.ok) {
    throw new Error('Coult not increment cart item amount');
  }
};

export const decrementCartItemAmount = async (productId: string) => {
  const res = await fetch(`/api/cart/${productId}/amount?action=decrement`, {
    method: 'PUT',
  });

  if (!res.ok) {
    throw new Error('Coult not decrement cart item amount');
  }
};

export const removeCartItem = async (productId: string) => {
  const res = await fetch(`/api/cart/${productId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Coult not remove cart item');
  }
};

export const checkout = async (): Promise<NewOrderDto> => {
  const res = await fetch('/api/orders', { method: 'POST' });

  if (!res.ok) {
    throw new Error('Coult not checkout cart items');
  }

  return res.json();
};
