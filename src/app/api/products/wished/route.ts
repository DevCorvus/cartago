import { getUserSession } from '@/server/auth/auth.utils';
import { productService } from '@/server/services';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getUserSession();

  if (!user) return NextResponse.json(null, { status: 401 });

  try {
    const products = await productService.findAllWishedFromUser(user.id);
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
