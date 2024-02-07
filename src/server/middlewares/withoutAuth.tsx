import { getUserSession } from '@/server/auth/auth.utils';
import { redirect } from 'next/navigation';

export default function withoutAuth(Component: React.FC) {
  return async function WithoutAuth(props: any) {
    const user = await getUserSession();

    if (user) {
      redirect('/');
    }

    return <Component {...props} />;
  };
}
