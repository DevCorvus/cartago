import { getUserSession } from '@/server/auth/auth.utils';
import { reviewService } from '@/server/services';
import { Params } from '@/shared/dtos/params.dto';
import { paramsSchema } from '@/shared/schemas/params.schema';
import { createUpdateReviewSchema } from '@/shared/schemas/review.schema';
import { NextRequest, NextResponse } from 'next/server';

interface Props {
  params: Params;
}

export async function PUT(req: NextRequest, { params }: Props) {
  const user = await getUserSession();

  if (!user) return NextResponse.json(null, { status: 401 });

  const paramsResult = await paramsSchema.safeParseAsync(params);

  if (!paramsResult.success) return NextResponse.json(null, { status: 400 });

  const json = await req.json();
  const jsonResult = await createUpdateReviewSchema.safeParseAsync(json);

  if (!jsonResult.success) return NextResponse.json(null, { status: 400 });

  const reviewId = paramsResult.data.id;
  const data = jsonResult.data;

  try {
    const userHasReview = await reviewService.exists(reviewId, user.id);

    if (!userHasReview) return NextResponse.json(null, { status: 403 });

    const updatedReview = await reviewService.update(reviewId, data);
    return NextResponse.json(updatedReview, { status: 200 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
