import { UserSession } from '@/shared/auth/auth.types';
import withAuth from '@/server/middlewares/withAuth';
import { userService } from '@/server/services';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  user: UserSession;
}

async function Account({ user }: Props) {
  const profile = await userService.getProfile(user.id);

  if (!profile) {
    notFound();
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <header className="w-full">
        <h1 className="text-2xl font-bold text-green-800">Account</h1>
      </header>
      <table className="text-left">
        <tbody>
          <tr>
            <th>Name</th>
            <td>{profile.fullname}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{profile.email}</td>
          </tr>
          <tr>
            <th>Role</th>
            <td className="font-bold text-green-700">{profile.role}</td>
          </tr>
          <tr>
            <th>Created at</th>
            <td>{profile.createdAt.toDateString()}</td>
          </tr>
          <tr>
            <th>Last update</th>
            <td>{profile.updatedAt.toDateString()}</td>
          </tr>
        </tbody>
      </table>
      <hr />
      <ul className="space-y-1">
        <li>
          <Link
            href="/account/addresses"
            className="text-blue-400 transition hover:text-blue-500 focus:text-blue-500"
          >
            Addresses
          </Link>
        </li>
        <li>
          <Link
            href="/account/orders"
            className="text-blue-400 transition hover:text-blue-500 focus:text-blue-500"
          >
            Orders
          </Link>
        </li>
        <li>
          <Link
            href="/account/change-password"
            className="text-blue-400 transition hover:text-blue-500 focus:text-blue-500"
          >
            Change password
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default withAuth(Account);
