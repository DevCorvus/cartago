import { useClickOutside } from '@/hooks/useClickOutside';
import { useUser } from '@/hooks/useUser';
import { hasPermissions } from '@/shared/auth/auth.utils';
import { Permissions } from '@/shared/auth/rbac';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import {
  HiMiniHeart,
  HiMiniShoppingBag,
  HiMiniTag,
  HiMiniTruck,
  HiMiniUser,
  HiShoppingCart,
} from 'react-icons/hi2';

interface MenuProps {
  setShowMenu: Dispatch<SetStateAction<boolean>>;
}

export default function DropdownMenu({ setShowMenu }: MenuProps) {
  const user = useUser();

  const ref = useClickOutside<HTMLDivElement>(() => setShowMenu(false));

  const handleSubmit = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
    setShowMenu(false);
  };

  return (
    <div ref={ref} className="min-w-48 absolute right-0 top-12">
      <div className="space-y-4 rounded-b-lg border-t border-slate-100 bg-slate-50 p-6 font-normal shadow-md">
        {!user && (
          <>
            <section>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/login"
                    className="btn inline-block w-full py-2"
                    onClick={() => setShowMenu(false)}
                  >
                    Login
                  </Link>
                </li>
                <li className="text-center">
                  <Link
                    href="/register"
                    onClick={() => setShowMenu(false)}
                    className="flex w-full justify-center rounded-full bg-slate-200/50 py-2 text-slate-600 transition hover:text-cyan-600 focus:text-cyan-600"
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </section>
            <hr />
          </>
        )}
        <section className="flex flex-col items-center gap-2 text-slate-600">
          <ul className="w-full">
            <li>
              <Link
                href="/cart"
                onClick={() => setShowMenu(false)}
                className="flex w-full items-center gap-1 rounded-lg p-1 transition hover:bg-slate-200/50 hover:shadow-sm focus:bg-slate-200/50 focus:shadow-sm"
              >
                <HiShoppingCart />
                Cart
              </Link>
            </li>
            <li>
              <Link
                href="/items/wished"
                onClick={() => setShowMenu(false)}
                className="flex w-full items-center gap-1 rounded-lg p-1 transition hover:bg-slate-200/50 hover:shadow-sm focus:bg-slate-200/50 focus:shadow-sm"
              >
                <HiMiniHeart />
                Wish List
              </Link>
            </li>
            {user && (
              <>
                {hasPermissions(user.role, [Permissions.VIEW_SELLER_PANEL]) && (
                  <li>
                    <Link
                      href="/seller/products"
                      onClick={() => setShowMenu(false)}
                      className="flex w-full items-center gap-1 rounded-lg p-1 transition hover:bg-slate-200/50 hover:shadow-sm focus:bg-slate-200/50 focus:shadow-sm"
                    >
                      <HiMiniShoppingBag />
                      My Products
                    </Link>
                  </li>
                )}
                {hasPermissions(user.role, [Permissions.VIEW_ADMIN_PANEL]) && (
                  <li>
                    <Link
                      href="/admin/categories"
                      onClick={() => setShowMenu(false)}
                      className="flex w-full items-center gap-1 rounded-lg p-1 transition hover:bg-slate-200/50 hover:shadow-sm focus:bg-slate-200/50 focus:shadow-sm"
                    >
                      <HiMiniTag />
                      Categories
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    href="/account/orders"
                    onClick={() => setShowMenu(false)}
                    className="flex w-full items-center gap-1 rounded-lg p-1 transition hover:bg-slate-200/50 hover:shadow-sm focus:bg-slate-200/50 focus:shadow-sm"
                  >
                    <HiMiniTruck />
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account"
                    onClick={() => setShowMenu(false)}
                    className="flex w-full items-center gap-1 rounded-lg p-1 transition hover:bg-slate-200/50 hover:shadow-sm focus:bg-slate-200/50 focus:shadow-sm"
                  >
                    <HiMiniUser />
                    Account
                  </Link>
                </li>
              </>
            )}
          </ul>
        </section>
        {user && (
          <>
            <hr />
            <section>
              <ul>
                <li>
                  <button
                    onClick={handleSubmit}
                    className="flex w-full justify-center rounded-full bg-slate-200/50 py-2 text-slate-600 transition hover:text-cyan-600 focus:text-cyan-600"
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
