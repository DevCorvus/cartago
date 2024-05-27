'use client';

import { UserProfileDto } from '@/shared/dtos/user.dto';
import Link from 'next/link';

interface Props {
  profile: UserProfileDto;
}

export default function AccountDetails({ profile }: Props) {
  return (
    <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 text-slate-700 shadow-md">
      <header className="w-full">
        <h1 className="text-2xl font-bold text-cyan-700">Account</h1>
      </header>
      <table className="w-full text-left">
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
            <td className="font-bold text-cyan-700">{profile.role}</td>
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
            className="text-cyan-600 transition hover:text-cyan-500 focus:text-cyan-500"
          >
            Addresses
          </Link>
        </li>
        <li>
          <Link
            href="/account/orders"
            className="text-cyan-600 transition hover:text-cyan-500 focus:text-cyan-500"
          >
            Orders
          </Link>
        </li>
        <li>
          <Link
            href="/account/change-password"
            className="text-cyan-600 transition hover:text-cyan-500 focus:text-cyan-500"
          >
            Change password
          </Link>
        </li>
      </ul>
    </div>
  );
}
