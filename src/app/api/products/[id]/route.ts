import { checkUserPermissions, getUserSession } from '@/server/auth/auth.utils';
import { Permissions } from '@/server/auth/rbac';
import { productService, storageService } from '@/server/services';
import { Params } from '@/shared/dtos/params.dto';
import { CreateUpdateProductDto } from '@/shared/dtos/product.dto';
import { paramsSchema } from '@/shared/schemas/params.schema';
import { createUpdateProductSchema } from '@/shared/schemas/product.schema';
import { NextRequest, NextResponse } from 'next/server';

interface Props {
  params: Params;
}

// This is highly inefficient but way simpler to implement and good enough for now
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

    data = await createUpdateProductSchema.parseAsync(input);
  } catch {
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

    await productService.deleteImages(productId);
    await storageService.deleteMany(product.images);

    await productService.deleteCategories(productId);

    const images = await storageService.saveMany(data.images);

    await productService.update(productId, user.id, {
      ...data,
      images,
    });

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
