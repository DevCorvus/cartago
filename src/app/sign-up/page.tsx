import SignUpForm from '@/components/ui/SignUpForm';
import { countryService } from '@/server/services';

export default async function SignUp() {
  const countries = await countryService.findAll();

  return (
    <div className="flex-1 bg-amber-50 flex items-center justify-center">
      <SignUpForm countries={countries} />
    </div>
  );
}
