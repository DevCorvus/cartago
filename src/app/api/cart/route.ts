import { getUserSession } from '@/server/auth/auth.utils';
import { cartService } from '@/server/services';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getUserSession();

  if (!user) {
    return NextResponse.json(null, { status: 401 });
  }

  const cartId = user.cartId;

  try {
    const cartItem = await cartService.findAllItems(cartId);
    return NextResponse.json(cartItem, { status: 201 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
