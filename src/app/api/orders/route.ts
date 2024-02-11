import { getUserSession } from '@/server/auth/auth.utils';
import { orderService } from '@/server/services';
import { NextResponse } from 'next/server';

export async function POST() {
  const user = await getUserSession();

  if (!user) {
    return NextResponse.json(null, { status: 401 });
  }

  try {
    const newOrder = await orderService.create(user.cartId);
    return NextResponse.json(newOrder, { status: 201 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
