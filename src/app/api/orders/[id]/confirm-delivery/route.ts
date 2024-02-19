import { getUserSession } from '@/server/auth/auth.utils';
import { orderService } from '@/server/services';
import { Params } from '@/shared/dtos/params.dto';
import { paramsSchema } from '@/shared/schemas/params.schema';
import { NextRequest, NextResponse } from 'next/server';

interface Props {
  params: Params;
}

export async function PUT(_req: NextRequest, { params }: Props) {
  const user = await getUserSession();

  if (!user) {
    return NextResponse.json(null, { status: 401 });
  }

  const result = await paramsSchema.safeParseAsync(params);

  if (!result.success) {
    return NextResponse.json(null, { status: 400 });
  }

  const orderId = result.data.id;

  try {
    const userHasOrder = await orderService.exists(orderId, user.id);

    if (!userHasOrder) return NextResponse.json(null, { status: 403 });

    const orderStatus = await orderService.getStatus(orderId);

    if (orderStatus !== 'SHIPPED') {
      return NextResponse.json(null, { status: 400 });
    }

    await orderService.confirmDelivery(orderId);
    return NextResponse.json(null, { status: 200 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
