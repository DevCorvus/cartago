import { checkUserPermissions, getUserSession } from '@/server/auth/auth.utils';
import { Permissions } from '@/shared/auth/rbac';
import { moderationService, productService } from '@/server/services';
import { Params } from '@/shared/dtos/params.dto';
import { CreateUpdateProductDto } from '@/shared/dtos/product.dto';
import { paramsSchema } from '@/shared/schemas/params.schema';
import { createUpdateProductSchema } from '@/shared/schemas/product.schema';
import { NextRequest, NextResponse } from 'next/server';

interface Props {
  params: Params;
}

export async function PUT(req: NextRequest, { params }: Props) {
  const user = await getUserSession();

  if (!user) return NextResponse.json(null, { status: 401 });

  const hasPermissions = await checkUserPermissions(
    [Permissions.EDIT_PRODUCT],
    user.role,
  );

  if (!hasPermissions) return NextResponse.json(null, { status: 403 });

  const result = await paramsSchema.safeParseAsync(params);

  if (!result.success) return NextResponse.json(null, { status: 400 });

  let data: CreateUpdateProductDto;

  try {
    const formData = await req.formData();

    const input = {
      title: formData.get('title'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
      images: formData.getAll('images'),
      categories: JSON.parse(formData.get('categories') as string),
    };

    if (typeof input.description === 'string') {
      input.description = input.description.replaceAll('\r\n', '\n');
    }

    data = await createUpdateProductSchema.parseAsync(input);
  } catch {
    return NextResponse.json(null, { status: 400 });
  }

  const productId = result.data.id;

  try {
    const productOwnerId = await productService.findOwnerId(productId);

    if (!productOwnerId) {
      return NextResponse.json(null, { status: 404 });
    }

    if (productOwnerId !== user.id) {
      return NextResponse.json(null, { status: 403 });
    }

    for (const file of data.images) {
      const isAdultRatedImage =
        await moderationService.checkAdultRatedImage(file);

      if (isAdultRatedImage) {
        return NextResponse.json(null, { status: 400 });
      }
    }

    await productService.update(productId, user.id, data);

    return NextResponse.json(null, { status: 201 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
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

    await productService.delete(productId);

    return NextResponse.json(null, { status: 200 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
