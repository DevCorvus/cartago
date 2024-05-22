import { moderationService, productService } from '@/server/services';
import { CreateProductDto } from '@/shared/dtos/product.dto';
import { createProductSchema } from '@/shared/schemas/product.schema';
import { NextRequest, NextResponse } from 'next/server';
import { checkUserPermissions, getUserSession } from '@/server/auth/auth.utils';
import { Permissions } from '@/shared/auth/rbac';
import { z } from 'zod';

const lastIdSchema = z.string().uuid().nullable();
const categoryIdSchema = z.coerce.number().int().positive().nullable();

export async function GET(req: NextRequest) {
  const user = await getUserSession();

  const searchParams = req.nextUrl.searchParams;

  const lastIdResult = await lastIdSchema.safeParseAsync(
    searchParams.get('lastId'),
  );
  if (!lastIdResult.success) return NextResponse.json(null, { status: 400 });

  const categoryIdResult = await categoryIdSchema.safeParseAsync(
    searchParams.get('categoryId'),
  );
  if (!categoryIdResult.success)
    return NextResponse.json(null, { status: 400 });

  const lastId = lastIdResult.data || undefined;
  const categoryId = categoryIdResult.data || undefined;

  try {
    const products = await productService.findAll({
      userId: user?.id,
      lastId,
      categoryId,
    });
    return NextResponse.json(products);
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
    [Permissions.CREATE_PRODUCT],
    user.role,
  );

  if (!hasPermissions) {
    return NextResponse.json(null, { status: 403 });
  }

  let data: CreateProductDto;

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

    data = await createProductSchema.parseAsync(input);
  } catch {
    return NextResponse.json(null, { status: 400 });
  }

  try {
    for (const file of data.images) {
      const isAdultRatedImage =
        await moderationService.checkAdultRatedImage(file);

      if (isAdultRatedImage) {
        // TODO: Ban seller
        return NextResponse.json(null, { status: 400 });
      }
    }

    const newProduct = await productService.create(user.id, data);

    return NextResponse.json(newProduct, { status: 201 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
