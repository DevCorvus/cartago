import { prisma } from '@/lib/prisma';
import { ProductCardDto } from '@/shared/dtos/product.dto';

export class WishedItemService {
  async findAllIds(userId: string): Promise<string[] | null> {
    const wishedItems = await prisma.wishedItem.findMany({
      where: { userId },
      select: { productId: true },
    });

    return wishedItems ? wishedItems.map((item) => item.productId) : null;
  }

  async findAllItems(userId: string): Promise<ProductCardDto[]> {
    const wishedItems = await prisma.wishedItem.findMany({
      where: { userId },
      select: {
        product: {
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
        },
      },
    });

    return wishedItems.map((item) => item.product);
  }

  async create(userId: string, productId: string): Promise<boolean> {
    if (await this.exists(userId, productId)) {
      return false;
    }

    await prisma.wishedItem.create({ data: { userId, productId } });
    return true;
  }

  async delete(userId: string, productId: string): Promise<boolean> {
    if (!(await this.exists(userId, productId))) {
      return false;
    }

    await prisma.wishedItem.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
    return true;
  }

  async exists(userId: string, productId: string): Promise<boolean> {
    const count = await prisma.wishedItem.count({
      where: { userId, productId },
    });
    return count > 0;
  }
}
