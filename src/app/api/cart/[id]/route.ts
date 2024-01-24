import { NextRequest, NextResponse } from 'next/server';
import { paramsSchema } from '@/shared/schemas/params.schema';
import { Params } from '@/shared/dtos/params.dto';
import { cartService } from '@/server/services';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/server/auth/next-auth.config';

interface Props {
  params: Params;
}

export async function POST(_req: NextRequest, { params }: Props) {
  const session = await getServerSession(nextAuthOptions);

  if (!session) {
    return NextResponse.json(null, { status: 401 });
  }

  const result = await paramsSchema.safeParseAsync(params);

  if (!result.success) {
    return NextResponse.json(null, { status: 400 });
  }

  const cartId = session.user.cartId;
  const productId = result.data.id;

  try {
    const cartItemAlreadyExists = await cartService.cartItemExists(
      cartId,
      productId,
    );

    if (cartItemAlreadyExists) {
      return NextResponse.json(
        { message: 'Product already in the cart' },
        { status: 409 },
      );
    }

    await cartService.addItem(cartId, productId);

    return NextResponse.json(
      { message: 'Cart item added successfully' },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}
