import SignUpForm from '@/components/ui/SignUpForm';
import { getUserSession } from '@/server/auth/auth.utils';
import { redirect } from 'next/navigation';

export default async function SignUp() {
  const user = await getUserSession();

  if (user) {
    redirect('/');
  }

  return <SignUpForm />;
}
