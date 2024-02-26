import { AddressList } from '@/components/ui/AddressList';
import withAuth from '@/server/middlewares/withAuth';

function Addresses() {
  return <AddressList />;
}

export default withAuth(Addresses);
