import { SignInForm } from '@/components/ui/SignInForm';
import withAuth from '@/server/middlewares/withAuth';

async function SignIn() {
  return <SignInForm />;
}

export default withAuth(SignIn);
