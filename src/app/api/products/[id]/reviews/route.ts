import { getUserSession } from '@/server/auth/auth.utils';
import { productService, reviewService } from '@/server/services';
import { Params } from '@/shared/dtos/params.dto';
import { paramsSchema } from '@/shared/schemas/params.schema';
import { createReviewSchema } from '@/shared/schemas/review.schema';
import { NextRequest, NextResponse } from 'next/server';

interface Props {
  params: Params;
}

export async function GET(_req: NextRequest, { params }: Props) {
  const result = await paramsSchema.safeParseAsync(params);

  if (!result.success) return NextResponse.json(null, { status: 400 });

  const productId = result.data.id;

  try {
    const exists = await productService.exists(productId);

    if (!exists) return NextResponse.json(null, { status: 404 });

    const reviews = await reviewService.findAll(productId);

    return NextResponse.json(reviews, { status: 200 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Props) {
  const user = await getUserSession();

  if (!user) return NextResponse.json(null, { status: 401 });

  const paramsResult = await paramsSchema.safeParseAsync(params);

  if (!paramsResult.success) return NextResponse.json(null, { status: 400 });

  const json = await req.json();
  const jsonResult = await createReviewSchema.safeParseAsync(json);

  if (!jsonResult.success) return NextResponse.json(null, { status: 400 });

  const productId = paramsResult.data.id;
  const data = jsonResult.data;

  try {
    const newReview = await reviewService.create(productId, user.id, data);
    return NextResponse.json(newReview, { status: 200 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
