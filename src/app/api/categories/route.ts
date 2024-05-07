import { checkUserPermissions, getUserSession } from '@/server/auth/auth.utils';
import { Permissions } from '@/shared/auth/rbac';
import { categoryService } from '@/server/services';
import { CreateUpdateCategoryDto } from '@/shared/dtos/category.dto';
import { createUpdateCategorySchema } from '@/shared/schemas/category.schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const title = searchParams.get('title');

  try {
    if (title) {
      const categories = await categoryService.findAll(
        title.trim().toLowerCase(),
      );
      return NextResponse.json(categories, { status: 200 });
    } else {
      const categories = await categoryService.findAll();
      return NextResponse.json(categories, { status: 200 });
    }
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

  const json = await req.json();
  const result = await createUpdateCategorySchema.safeParseAsync(json);

  if (!result.success) {
    return NextResponse.json(null, { status: 400 });
  }

  const data: CreateUpdateCategoryDto = result.data;

  try {
    const newCategoryTag = await categoryService.create(data);

    return NextResponse.json(newCategoryTag, { status: 201 });
  } catch {
    return NextResponse.json(null, { status: 409 });
  }
}
