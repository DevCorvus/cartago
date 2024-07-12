import AddOrderForm from '@/components/ui/AddOrderForm.tsx';
import { orderService } from '@/server/services';
import { Params } from '@/shared/dtos/params.dto';
import { paramsSchema } from '@/shared/schemas/params.schema';
import { notFound, redirect } from 'next/navigation';
import { getUserSession } from '@/server/auth/auth.utils';

interface Props {
  params: Params;
}

export default async function Checkout({ params }: Props) {
  const user = await getUserSession();

  if (!user) {
    redirect('/login');
  }

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
