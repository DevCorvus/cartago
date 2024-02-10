import SignUpForm from '@/components/ui/SignUpForm';
import withoutAuth from '@/server/middlewares/withoutAuth';
import { countryService } from '@/server/services';

async function SignUp() {
  const countries = await countryService.findAll();
  return <SignUpForm countries={countries} />;
}

export default withoutAuth(SignUp);
