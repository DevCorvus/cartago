import { checkUserPermissions, getUserSession } from '@/server/auth/auth.utils';
import { Permissions } from '@/shared/auth/rbac';
import { categoryService } from '@/server/services';
import { CreateUpdateCategoryDto } from '@/shared/dtos/category.dto';
import { NumericParams } from '@/shared/dtos/params.dto';
import { createUpdateCategorySchema } from '@/shared/schemas/category.schema';
import { numericParamsSchema } from '@/shared/schemas/params.schema';
import { NextRequest, NextResponse } from 'next/server';

interface Props {
  params: NumericParams;
}

export async function PUT(req: NextRequest, { params }: Props) {
  const user = await getUserSession();

  if (!user) {
    return NextResponse.json(null, { status: 401 });
  }

  const hasPermissions = await checkUserPermissions(
    [Permissions.CREATE_CATEGORY],
    user.role,
  );

  if (!hasPermissions) {
    return NextResponse.json(null, { status: 403 });
  }

  const paramsResult = await numericParamsSchema.safeParseAsync(params);

  if (!paramsResult.success) {
    return NextResponse.json(null, { status: 400 });
  }

  const categoryId = paramsResult.data.id;

  const json = await req.json();
  const jsonResult = await createUpdateCategorySchema.safeParseAsync(json);

  if (!jsonResult.success) {
    return NextResponse.json(null, { status: 400 });
  }

  const data: CreateUpdateCategoryDto = jsonResult.data;

  try {
    const updatedCategory = await categoryService.update(categoryId, data);

    return NextResponse.json(updatedCategory, { status: 201 });
  } catch {
    return NextResponse.json(null, { status: 409 });
  }
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
