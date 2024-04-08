import { productService } from '@/server/services';
import { idsArrayFromSeachParamsSchema } from '@/shared/schemas/params.schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const items = searchParams.get('items');

  const result = await idsArrayFromSeachParamsSchema.safeParseAsync(items);

  if (!result.success) {
    return NextResponse.json(null, { status: 400 });
  }

  const wishedItemIds = result.data;

  try {
    const wishedItems =
      await productService.findAllWishedFromIds(wishedItemIds);

    return NextResponse.json(wishedItems, { status: 200 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
