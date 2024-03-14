import WishList from '@/components/ui/WishList';
import { getUserSession } from '@/server/auth/auth.utils';
import { wishedItemService } from '@/server/services';

export default async function Wished() {
  const user = await getUserSession();

  let products = null;

  if (user) {
    products = await wishedItemService.findAllItems(user.id);
  }

  return (
    <div>
      <header>
        <h1 className="text-2xl font-bold text-green-800">Wish List </h1>
      </header>
      <div>
        <WishList products={products} />
      </div>
    </div>
  );
}
