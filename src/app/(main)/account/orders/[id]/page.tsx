import { orderService } from '@/server/services';
import { Params } from '@/shared/dtos/params.dto';
import { paramsSchema } from '@/shared/schemas/params.schema';
import { notFound, redirect } from 'next/navigation';
import OrderDetails from '@/components/ui/OrderDetails';
import { getUserSession } from '@/server/auth/auth.utils';

interface Props {
  params: Params;
}

export default async function Order({ params }: Props) {
  const user = await getUserSession();

  if (!user) {
    redirect('/login');
  }

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
