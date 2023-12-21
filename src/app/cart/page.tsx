import ProductCartList from '@/components/ui/ProductCartList';
import Unauthorized from '@/components/ui/Unauthorized';
import { nextAuthOptions } from '@/server/auth/next-auth.config';
import { cartService } from '@/server/services';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

export default async function Cart() {
  const session = await getServerSession(nextAuthOptions);

  if (!session) return <Unauthorized />;

  const cartProducts = await cartService.findAllItems(session.user.id);

  if (!cartProducts) return notFound();

  return <ProductCartList products={cartProducts} />;
}
