export const confirmDelivery = async (orderId: string) => {
  const res = await fetch(`/api/orders/${orderId}/confirm-delivery`, {
    method: 'PUT',
  });

  if (!res.ok) {
    throw new Error('Could not confirm delivery');
  }
};
