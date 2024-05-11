import ProductCardList from '@/components/ui/ProductCardList';
import { Permissions } from '@/shared/auth/rbac';
import withAuth from '@/server/middlewares/withAuth';

async function SellerProducts() {
  return <ProductCardList />;
}

export default withAuth(SellerProducts, [Permissions.VIEW_SELLER_PANEL]);
