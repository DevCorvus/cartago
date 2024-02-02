import ChangePasswordForm from '@/components/ui/ChangePasswordForm';
import { getUserSession } from '@/server/auth/auth.utils';
import { redirect } from 'next/navigation';

export default async function ChangePassword() {
  const user = await getUserSession();

  if (!user) {
    redirect('/login');
  }

  return <ChangePasswordForm />;
}
