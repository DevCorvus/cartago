import { nextAuthOptions } from '@/server/auth/next-auth.config';
import { wishedItemService } from '@/server/services';
import { Params } from '@/shared/dtos/params.dto';
import { paramsSchema } from '@/shared/schemas/params.schema';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

interface Props {
  params: Params;
}

export async function POST(_req: NextRequest, { params }: Props) {
  const session = await getServerSession(nextAuthOptions);

  if (!session) {
    return NextResponse.json(null, { status: 401 });
  }

  const result = await paramsSchema.safeParseAsync(params);

  if (!result.success) {
    return NextResponse.json(null, { status: 400 });
  }

  const userId = session.user.id;
  const productId = result.data.id;

  try {
    await wishedItemService.create(userId, productId);
    return NextResponse.json(null, { status: 201 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const session = await getServerSession(nextAuthOptions);

  if (!session) {
    return NextResponse.json(null, { status: 401 });
  }

  const result = await paramsSchema.safeParseAsync(params);

  if (!result.success) {
    return NextResponse.json(null, { status: 400 });
  }

  const userId = session.user.id;
  const productId = result.data.id;

  try {
    await wishedItemService.delete(userId, productId);
    return NextResponse.json(null, { status: 200 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
