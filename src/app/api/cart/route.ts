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
    const cartItems = await cartService.findAllItems(cartId);
    return NextResponse.json(cartItems, { status: 200 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
