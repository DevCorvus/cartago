import { getUserSession } from '@/server/auth/auth.utils';
import { userService } from '@/server/services';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

export default async function Account() {
  const user = await getUserSession();

  if (!user) {
    redirect('/sign-in');
  }

  const profile = await userService.getProfile(user.id);

  if (!profile) {
    notFound();
  }

  return (
    <div className="max-w-md w-full flex flex-col gap-6">
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
            <td className="text-green-700 font-bold">{profile.role}</td>
          </tr>
          <tr>
            <th>Country</th>
            <td>{profile.country}</td>
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
      <ul>
        <li>
          <Link
            href="/account/change-password"
            className="text-blue-400 hover:text-blue-500 focus:text-blue-500 transition"
          >
            Change password
          </Link>
        </li>
      </ul>
    </div>
  );
}
