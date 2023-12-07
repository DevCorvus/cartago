import SignUpForm from '@/components/ui/SignUpForm';
import { countryService } from '@/server/services';

export default async function SignUp() {
  const countries = await countryService.findAll();

  return (
    <div className="bg-amber-50 flex items-center justify-center min-h-screen pt-20">
      <SignUpForm countries={countries} />
    </div>
  );
}
