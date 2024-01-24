import { nextAuthOptions } from '@/server/auth/next-auth.config';
import { cartService } from '@/server/services';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(nextAuthOptions);

  if (!session) {
    return NextResponse.json(null, { status: 401 });
  }

  const cartId = session.user.cartId;

  try {
    const productIds = await cartService.findAllItemIds(cartId);
    return NextResponse.json(productIds, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: 'Product already in the cart' },
      { status: 409 },
    );
  }
}
