import { NextRequest, NextResponse } from 'next/server';
import { createUserSchema } from '@/shared/schemas/user.schema';
import { CreateUserDto } from '@/shared/dtos/user.dto';
import { userService } from '@/server/services';
import { getUserSession } from '@/server/auth/auth.utils';

export async function POST(req: NextRequest) {
  const user = await getUserSession();

  if (user) {
    return NextResponse.json(null, { status: 403 });
  }

  const json = await req.json();
  const result = await createUserSchema.safeParseAsync(json);

  if (!result.success) {
    return NextResponse.json(null, { status: 400 });
  }

  const data: CreateUserDto = result.data;

  try {
    await userService.create(data);
    return NextResponse.json(null, { status: 201 });
  } catch {
    return NextResponse.json(null, { status: 409 });
  }
}
