import SignUpForm from '@/components/ui/SignUpForm';
import withoutAuth from '@/server/middlewares/withoutAuth';

async function SignUp() {
  return <SignUpForm />;
}

export default withoutAuth(SignUp);
