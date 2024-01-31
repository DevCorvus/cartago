import { productService } from '@/server/services';
import { CreateProductDto } from '@/shared/dtos/product.dto';
import { createProductSchema } from '@/shared/schemas/product.schema';
import { NextRequest, NextResponse } from 'next/server';
import { existsSync } from 'fs';
import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { checkUserPermissions, getUserSession } from '@/server/auth/auth.utils';
import { Permissions } from '@/server/auth/rbac';

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

  const imagesDir = path.join(process.cwd(), '/public/uploads');
  const images: string[] = [];

  try {
    if (!existsSync(imagesDir)) {
      await mkdir(imagesDir);
    }

    await Promise.all(
      data.images.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name}`;

        await writeFile(path.join(imagesDir, filename), buffer);

        images.push(filename);
      }),
    );
  } catch {
    try {
      await Promise.all(
        images.map(async (filename) => {
          await unlink(path.join(imagesDir, filename));
        }),
      );
    } catch {}
    return NextResponse.json(null, { status: 500 });
  }

  try {
    const newProduct = await productService.create(user.id, {
      ...data,
      images,
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
