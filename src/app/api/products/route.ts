import { productService, storageService } from '@/server/services';
import { CreateUpdateProductDto } from '@/shared/dtos/product.dto';
import { createUpdateProductSchema } from '@/shared/schemas/product.schema';
import { NextRequest, NextResponse } from 'next/server';
import { checkUserPermissions, getUserSession } from '@/server/auth/auth.utils';
import { Permissions } from '@/server/auth/rbac';

export async function GET() {
  const user = await getUserSession();

  if (!user) {
    return NextResponse.json(null, { status: 401 });
  }

  try {
    const products = await productService.findAllFromUser(user.id);
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

  try {
    const images = await storageService.saveMany(data.images);

    const newProduct = await productService.create(user.id, {
      ...data,
      images,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
