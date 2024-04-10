import AddOrderForm from '@/components/ui/AddOrderForm.tsx';
import { UserSession } from '@/server/auth/auth.types';
import withAuth from '@/server/middlewares/withAuth';
import { orderService } from '@/server/services';
import { Params } from '@/shared/dtos/params.dto';
import { paramsSchema } from '@/shared/schemas/params.schema';
import { notFound } from 'next/navigation';

interface Props {
  params: Params;
  user: UserSession;
}

async function Checkout({ params, user }: Props) {
  const result = await paramsSchema.safeParseAsync(params);

  if (!result.success) {
    notFound();
  }

  const orderId = result.data.id;

  const checkoutOrder = await orderService.findCheckoutOrderById(
    orderId,
    user.id,
  );

  if (!checkoutOrder) {
    notFound();
  }

  return <AddOrderForm order={checkoutOrder} />;
}

export default withAuth(Checkout);
