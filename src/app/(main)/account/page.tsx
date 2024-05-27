import { UserSession } from '@/shared/auth/auth.types';
import withAuth from '@/server/middlewares/withAuth';
import { userService } from '@/server/services';
import { notFound } from 'next/navigation';
import AccountDetails from '@/components/ui/AccountDetails';

interface Props {
  user: UserSession;
}

async function Account({ user }: Props) {
  const profile = await userService.getProfile(user.id);

  if (!profile) {
    notFound();
  }

  return <AccountDetails profile={profile} />;
}

export default withAuth(Account);
