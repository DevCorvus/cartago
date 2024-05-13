import { getUserSession } from '@/server/auth/auth.utils';
import { cartService } from '@/server/services';
import { Params } from '@/shared/dtos/params.dto';
import { paramsSchema } from '@/shared/schemas/params.schema';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const searchParamsSchema = z.object({
  value: z.coerce.number().int().positive().min(1),
});

interface Props {
  params: Params;
}

export async function PUT(req: NextRequest, { params }: Props) {
  const user = await getUserSession();

  if (!user) {
    return NextResponse.json(null, { status: 401 });
  }

  const paramsResult = await paramsSchema.safeParseAsync(params);

  if (!paramsResult.success) {
    return NextResponse.json(null, { status: 400 });
  }

  const searchParams = req.nextUrl.searchParams;

  const searchParamsResult = await searchParamsSchema.safeParseAsync({
    value: searchParams.get('value'),
  });

  if (!searchParamsResult.success) {
    return NextResponse.json(null, { status: 400 });
  }

  const amount = searchParamsResult.data.value;

  const cartId = user.cartId;
  const productId = paramsResult.data.id;

  try {
    await cartService.setCartItemAmount(cartId, productId, amount);
    return NextResponse.json(null);
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
