import { userService } from '@/server/services';
import { notFound, redirect } from 'next/navigation';
import AccountDetails from '@/components/ui/AccountDetails';
import { getUserSession } from '@/server/auth/auth.utils';

export default async function Account() {
  const user = await getUserSession();

  if (!user) {
    redirect('/login');
  }

  const profile = await userService.getProfile(user.id);

  if (!profile) {
    notFound();
  }

  return <AccountDetails profile={profile} />;
}
