import { prisma } from '@/lib/prisma';

export class WishedItemService {
  async findAllIds(userId: string): Promise<string[] | null> {
    const wishedItems = await prisma.wishedItem.findMany({
      where: { userId },
      select: { productId: true },
    });

    return wishedItems ? wishedItems.map((item) => item.productId) : null;
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
