import ChangePasswordForm from '@/components/ui/ChangePasswordForm';
import withAuth from '@/server/middlewares/withAuth';

async function ChangePassword() {
  return <ChangePasswordForm />;
}

export default withAuth(ChangePassword);
