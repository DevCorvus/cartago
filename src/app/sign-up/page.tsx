import SignUpForm from '@/components/ui/SignUpForm';
import { countryService } from '@/server/services';

export default async function SignUp() {
  const countries = await countryService.findAll();

  return <SignUpForm countries={countries} />;
}
