import SignUpForm from '@/components/ui/SignUpForm';
import { getUserSession } from '@/server/auth/auth.utils';
import { countryService } from '@/server/services';
import { redirect } from 'next/navigation';

export default async function SignUp() {
  const user = await getUserSession();

  if (user) {
    redirect('/');
  }

  const countries = await countryService.findAll();

  return <SignUpForm countries={countries} />;
}
