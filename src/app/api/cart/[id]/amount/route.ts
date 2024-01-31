import { getUserSession } from '@/server/auth/auth.utils';
import { cartService } from '@/server/services';
import { Params } from '@/shared/dtos/params.dto';
import { paramsSchema } from '@/shared/schemas/params.schema';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const searchParamsSchema = z.object({
  action: z.enum(['increment', 'decrement']),
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
    action: searchParams.get('action'),
  });

  if (!searchParamsResult.success) {
    return NextResponse.json(null, { status: 400 });
  }

  const action = searchParamsResult.data.action;
  const cartId = user.cartId;
  const productId = paramsResult.data.id;

  let success = false;

  switch (action) {
    case 'increment': {
      success = await cartService.incrementCartItemAmount(cartId, productId);
      break;
    }
    case 'decrement': {
      success = await cartService.decrementCartItemAmount(cartId, productId);
      break;
    }
  }

  if (!success) {
    return NextResponse.json(null, { status: 500 });
  }

  return NextResponse.json(null);
}
