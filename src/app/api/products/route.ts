import { productService } from '@/server/services';
import { CreateProductDto } from '@/shared/dtos/product.dto';
import { createProductSchema } from '@/shared/schemas/product.schema';
import { NextRequest, NextResponse } from 'next/server';
import { existsSync } from 'fs';
import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
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
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }

  try {
    const newProduct = await productService.create({
      ...data,
      images,
    });
    return NextResponse.json(
      {
        message: 'Product created successfully',
        data: newProduct,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}
