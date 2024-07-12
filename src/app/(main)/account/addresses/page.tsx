import { AddressList } from '@/components/ui/AddressList';
import { getUserSession } from '@/server/auth/auth.utils';
import { redirect } from 'next/navigation';

export default async function Addresses() {
  const user = await getUserSession();

  if (!user) {
    redirect('/login');
  }

  return <AddressList />;
}
