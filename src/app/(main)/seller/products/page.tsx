import SellerProductList from '@/components/ui/SellerProductList';
import { Permissions } from '@/shared/auth/rbac';
import withAuth from '@/server/middlewares/withAuth';

async function SellerProducts() {
  return <SellerProductList />;
}

export default withAuth(SellerProducts, [Permissions.VIEW_SELLER_PANEL]);
