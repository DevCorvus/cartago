import { SignInForm } from '@/components/ui/SignInForm';
import withoutAuth from '@/server/middlewares/withoutAuth';

async function SignIn() {
  return <SignInForm />;
}

export default withoutAuth(SignIn);
