import { SignInForm } from '@/components/ui/SignInForm';
import { getUserSession } from '@/server/auth/auth.utils';
import { redirect } from 'next/navigation';

export default async function SignIn() {
  const user = await getUserSession();

  if (user) {
    redirect('/');
  }

  return (
    <div className="flex items-center justify-center pt-20 pb-10">
      <SignInForm />
    </div>
  );
}
