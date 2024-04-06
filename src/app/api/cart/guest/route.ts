import { productService } from '@/server/services';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const itemIdsSchema = z
  .string()
  .transform((str) => JSON.parse(str))
  .pipe(z.array(z.string().uuid()));

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const items = searchParams.get('items');

  const result = await itemIdsSchema.safeParseAsync(items);

  if (!result.success) {
    return NextResponse.json(null, { status: 400 });
  }

  const cartItemIds = result.data;

  try {
    const cartItems = await productService.findAllAsCartItems(cartItemIds);
    return NextResponse.json(cartItems, { status: 200 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
