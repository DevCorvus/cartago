import { prisma } from '@/lib/prisma';
import {
  ProductDto,
  CreateProductDto,
  ProductCardDto,
} from '@/shared/dtos/product.dto';

interface CreateProductInterface extends Omit<CreateProductDto, 'images'> {
  images: string[];
}

export class ProductService {
  constructor() {}

  async findAll(): Promise<ProductCardDto[]> {
    return prisma.product.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        images: {
          take: 1,
          select: {
            path: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAllFromUser(userId: string): Promise<ProductCardDto[]> {
    return prisma.product.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        images: {
          take: 1,
          select: {
            path: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<ProductDto | null> {
    return prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          select: {
            path: true,
          },
        },
        categories: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async exists(id: string, userId?: string): Promise<boolean> {
    const count = await prisma.product.count({ where: { id, userId } });
    return count > 0;
  }

  async create(
    userId: string,
    data: CreateProductInterface,
  ): Promise<ProductDto> {
    const newProduct = await prisma.product.create({
      data: {
        userId,
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
