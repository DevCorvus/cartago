import ProductCartList from '@/components/ui/ProductCartList';
import { nextAuthOptions } from '@/server/auth/next-auth.config';
import { cartService } from '@/server/services';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

export default async function Cart() {
  const session = await getServerSession(nextAuthOptions);

  if (session) {
    const cartProducts = await cartService.findAllItems(session.user.cartId);
    if (!cartProducts) return notFound();
    return <ProductCartList products={cartProducts} />;
  }

  return <ProductCartList products={[]} />;
}
