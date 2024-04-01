import { prisma } from '@/lib/prisma';
import { ProductCardWithSalesDto } from '@/shared/dtos/product.dto';
import { ProductService } from '../product/product.service';

export class WishedItemService {
  constructor(private productService: ProductService) {}

  async findAllIds(userId: string): Promise<string[] | null> {
    const wishedItems = await prisma.wishedItem.findMany({
      where: { userId },
      select: { productId: true },
    });

    return wishedItems ? wishedItems.map((item) => item.productId) : null;
  }

  async findAllItems(userId: string): Promise<ProductCardWithSalesDto[]> {
    const wishedItems = await prisma.wishedItem.findMany({
      where: { userId, product: { deletedAt: null } },
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

    const products = wishedItems.map((item) => item.product);

    const productsWithSales =
      await this.productService.getSalesFromProductCards(products);

    return productsWithSales;
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
