import { UserSession } from '@/server/auth/auth.types';
import withAuth from '@/server/middlewares/withAuth';
import { orderService } from '@/server/services';
import { Params } from '@/shared/dtos/params.dto';
import { paramsSchema } from '@/shared/schemas/params.schema';
import { notFound } from 'next/navigation';
import OrderDetails from '@/components/ui/OrderDetails';

interface Props {
  user: UserSession;
  params: Params;
}

async function Order({ user, params }: Props) {
  const result = await paramsSchema.safeParseAsync(params);

  if (!result.success) {
    notFound();
  }

  const order = await orderService.findById(result.data.id, user.id);

  if (!order) {
    notFound();
  }

  return <OrderDetails order={order} />;
}

export default withAuth(Order);
