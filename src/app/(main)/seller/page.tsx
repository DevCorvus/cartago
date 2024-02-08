import { Permissions } from '@/server/auth/rbac';
import withAuth from '@/server/middlewares/withAuth';
import Link from 'next/link';

function Seller() {
  return (
    <div className="max-w-md w-full flex flex-col gap-6">
      <header className="w-full">
        <h1 className="text-2xl font-bold text-green-800">Seller</h1>
      </header>
      <ul>
        <li>
          <Link
            href="/seller/products"
            className="text-blue-400 hover:text-blue-500 focus:text-blue-500 transition"
          >
            Products
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default withAuth(Seller, [Permissions.VIEW_SELLER_PANEL]);
