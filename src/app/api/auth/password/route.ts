import { getUserSession } from '@/server/auth/auth.utils';
import { userService } from '@/server/services';
import { updateUserPasswordSchema } from '@/shared/schemas/user.schema';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const user = await getUserSession();

  if (!user) {
    return NextResponse.json(null, { status: 401 });
  }

  const json = await req.json();

  const result = await updateUserPasswordSchema.safeParseAsync(json);

  if (!result.success) {
    return NextResponse.json(null, { status: 400 });
  }

  const data = result.data;

  try {
    const passwordsMatch = await userService.checkPassword(
      user.id,
      data.oldPassword,
    );

    if (!passwordsMatch) {
      return NextResponse.json(null, { status: 403 });
    }

    await userService.updatePassword(user.id, data.newPassword);
    return NextResponse.json(null, { status: 200 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
