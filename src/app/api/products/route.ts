import { productService } from '@/server/services';
import { CreateProductDto } from '@/shared/dtos/product.dto';
import { createProductSchema } from '@/shared/schemas/product.schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let data: CreateProductDto;

  try {
    const json = await req.json();
    data = await createProductSchema.parseAsync(json);
  } catch {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  try {
    const newProduct = await productService.create(data);
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
