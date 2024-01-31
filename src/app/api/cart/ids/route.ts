import { getUserSession } from '@/server/auth/auth.utils';
import { cartService } from '@/server/services';
import { NextResponse } from 'next/server';

// TODO: Remove this unnecessary endpoint (?)
export async function GET() {
  const user = await getUserSession();

  if (!user) {
    return NextResponse.json(null, { status: 401 });
  }

  const cartId = user.cartId;

  try {
    const cartItemIds = await cartService.findAllItemIds(cartId);
    return NextResponse.json(cartItemIds, { status: 201 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
