import { prisma } from '@/lib/prisma';
import { ProductDto, CreateProductDto } from '@/shared/dtos/product.dto';

export class ProductService {
  constructor() {}

  async find(id: string): Promise<ProductDto | null> {
    return prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        categories: true,
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await prisma.product.count({ where: { id } });
    return count > 0;
  }

  async create(data: CreateProductDto): Promise<ProductDto> {
    const newProduct = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        stock: data.stock,
        images: {
          createMany: {
            data: data.images.map((path) => ({
              path,
            })),
          },
        },
        categories: {
          connect: data.categories.map((categoryId) => ({
            id: categoryId,
          })),
        },
      },
      include: {
        images: true,
        categories: true,
      },
    });

    return newProduct;
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }
}
