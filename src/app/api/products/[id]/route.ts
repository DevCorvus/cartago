import { checkUserPermissions, getUserSession } from '@/server/auth/auth.utils';
import { Permissions } from '@/server/auth/rbac';
import { productService, storageService } from '@/server/services';
import { Params } from '@/shared/dtos/params.dto';
import { paramsSchema } from '@/shared/schemas/params.schema';
import { NextRequest, NextResponse } from 'next/server';

interface Props {
  params: Params;
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const user = await getUserSession();

  if (!user) {
    return NextResponse.json(null, { status: 401 });
  }

  const hasPermissions = await checkUserPermissions(
    [Permissions.DELETE_PRODUCT],
    user.role,
  );

  if (!hasPermissions) {
    return NextResponse.json(null, { status: 403 });
  }

  const result = await paramsSchema.safeParseAsync(params);

  if (!result.success) {
    return NextResponse.json(null, { status: 400 });
  }

  const productId = result.data.id;

  try {
    const product = await productService.findWithOwnerAndImages(productId);

    if (!product) {
      return NextResponse.json(null, { status: 404 });
    }

    if (product.userId !== user.id) {
      return NextResponse.json(null, { status: 403 });
    }

    await storageService.deleteMany(product.images);

    await productService.delete(productId);

    return NextResponse.json(null, { status: 200 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
