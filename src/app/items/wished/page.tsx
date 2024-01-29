import ProductList from '@/components/ui/ProductList';
import WishList from '@/components/ui/WishList';
import { nextAuthOptions } from '@/server/auth/next-auth.config';
import { wishedItemService } from '@/server/services';
import { getServerSession } from 'next-auth';

export default async function Wished() {
  const session = await getServerSession(nextAuthOptions);
  let products = null;

  if (session) {
    products = await wishedItemService.findAllItems(session.user.id);
  }
  return (
    <div>
      <header>
        <h1 className="text-green-800 font-bold text-2xl">Wish List </h1>
      </header>
      <div>
        <WishList products={products} />
      </div>
    </div>
  );
}
