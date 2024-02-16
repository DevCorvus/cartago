import { NextRequest, NextResponse } from 'next/server';
import { paramsSchema } from '@/shared/schemas/params.schema';
import { Params } from '@/shared/dtos/params.dto';
import { cartService, productService } from '@/server/services';
import { getUserSession } from '@/server/auth/auth.utils';

interface Props {
  params: Params;
}

export async function POST(_req: NextRequest, { params }: Props) {
  const user = await getUserSession();

  if (!user) {
    return NextResponse.json(null, { status: 401 });
  }

  const result = await paramsSchema.safeParseAsync(params);

  if (!result.success) {
    return NextResponse.json(null, { status: 400 });
  }

  const cartId = user.cartId;
  const productId = result.data.id;

  try {
    const productHasStock = await productService.hasStock(productId);

    if (!productHasStock) {
      return NextResponse.json(null, { status: 409 });
    }

    const cartItemAlreadyExists = await cartService.cartItemExists(
      cartId,
      productId,
    );

    if (cartItemAlreadyExists) {
      return NextResponse.json(null, { status: 409 });
    }

    await cartService.addItem(cartId, productId);
    return NextResponse.json(null, { status: 201 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const user = await getUserSession();

  if (!user) {
    return NextResponse.json(null, { status: 401 });
  }

  const result = await paramsSchema.safeParseAsync(params);

  if (!result.success) {
    return NextResponse.json(null, { status: 400 });
  }

  const cartId = user.cartId;
  const productId = result.data.id;

  try {
    await cartService.removeItemFromCart(cartId, productId);
    return NextResponse.json(null, { status: 200 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
