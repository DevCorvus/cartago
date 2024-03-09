import { prisma } from '@/lib/prisma';
import {
  ProductDto,
  CreateUpdateProductDto,
  ProductCardDto,
} from '@/shared/dtos/product.dto';

interface CreateUpdateProductInterface
  extends Omit<CreateUpdateProductDto, 'images'> {
  images: string[];
}

interface ProductWithOwnerAndImages {
  userId: string;
  images: string[];
}

export class ProductService {
  constructor() {}

  async findAll(): Promise<ProductCardDto[]> {
    return prisma.product.findMany({
      where: {
        deletedAt: null,
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

  async findAllFromUser(userId: string): Promise<ProductCardDto[]> {
    return prisma.product.findMany({
      where: {
        userId,
        deletedAt: null,
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

  async findById(id: string, userId?: string): Promise<ProductDto | null> {
    return prisma.product.findUnique({
      where: { id, userId, deletedAt: null },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        stock: true,
        createdAt: true,
        updatedAt: true,
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

  async findWithOwnerAndImages(
    id: string,
  ): Promise<ProductWithOwnerAndImages | null> {
    const product = await prisma.product.findUnique({
      where: { id, deletedAt: null },
      select: {
        userId: true,
        images: {
          select: {
            path: true,
          },
        },
      },
    });

    if (!product) return null;

    return {
      userId: product.userId,
      images: product.images.map((image) => image.path),
    };
  }

  async exists(id: string, userId?: string): Promise<boolean> {
    const count = await prisma.product.count({
      where: { id, userId, deletedAt: null },
    });
    return count > 0;
  }

  async hasStock(id: string) {
    const count = await prisma.product.count({
      where: { id, deletedAt: null, stock: { gt: 0 } },
    });
    return count > 0;
  }

  async create(
    userId: string,
    data: CreateUpdateProductInterface,
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

  async update(
    id: string,
    userId: string,
    data: CreateUpdateProductInterface,
  ): Promise<ProductDto> {
    const updatedProduct = await prisma.product.update({
      where: { id, userId },
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

    return updatedProduct;
  }

  async delete(id: string): Promise<void> {
    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async deleteImages(id: string): Promise<void> {
    await prisma.productImage.deleteMany({
      where: { productId: id },
    });
  }

  async deleteCategories(id: string): Promise<void> {
    await prisma.product.update({
      where: {
        id,
      },
      data: {
        categories: {
          set: [],
        },
      },
    });
  }
}
