import { getUserSession } from '@/server/auth/auth.utils';
import { paymentService } from '@/server/services';
import { Params } from '@/shared/dtos/params.dto';
import { paramsSchema } from '@/shared/schemas/params.schema';
import { createPaymentSchema } from '@/shared/schemas/payment.schema';
import { NextRequest, NextResponse } from 'next/server';

interface Props {
  params: Params;
}

export async function POST(req: NextRequest, { params }: Props) {
  const user = await getUserSession();

  if (!user) {
    return NextResponse.json(null, { status: 401 });
  }

  const paramsResult = await paramsSchema.safeParseAsync(params);

  if (!paramsResult.success) {
    return NextResponse.json(null, { status: 400 });
  }

  const json = await req.json();
  const jsonResult = await createPaymentSchema.safeParseAsync(json);

  if (!jsonResult.success) {
    return NextResponse.json(null, { status: 400 });
  }

  const orderId = paramsResult.data.id;
  const data = jsonResult.data;

  try {
    await paymentService.create(orderId, data);
    return NextResponse.json(null, { status: 201 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
