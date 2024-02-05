import { checkUserPermissions, getUserSession } from '@/server/auth/auth.utils';
import { Permissions } from '@/server/auth/rbac';
import { categoryService } from '@/server/services';
import { NumericParams } from '@/shared/dtos/params.dto';
import { numericParamsSchema } from '@/shared/schemas/params.schema';
import { NextRequest, NextResponse } from 'next/server';

interface Props {
  params: NumericParams;
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const user = await getUserSession();

  if (!user) {
    return NextResponse.json(null, { status: 401 });
  }

  const hasPermissions = await checkUserPermissions(
    [Permissions.DELETE_CATEGORY],
    user.role,
  );

  if (!hasPermissions) {
    return NextResponse.json(null, { status: 403 });
  }

  const result = await numericParamsSchema.safeParseAsync(params);

  if (!result.success) {
    return NextResponse.json(null, { status: 400 });
  }

  const categoryId = result.data.id;

  try {
    await categoryService.delete(categoryId);
    return NextResponse.json(null, { status: 200 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
