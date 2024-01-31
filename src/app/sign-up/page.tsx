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

  return (
    <div className="flex items-center justify-center pt-20 pb-10">
      <SignUpForm countries={countries} />
    </div>
  );
}
