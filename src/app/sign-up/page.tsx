import SignUpForm from '@/components/ui/SignUpForm';
import { countryService } from '@/server/services';

export default async function SignUp() {
  const countries = await countryService.findAll();

  return (
    <div className="flex items-center justify-center pt-20 pb-10">
      <SignUpForm countries={countries} />
    </div>
  );
}
