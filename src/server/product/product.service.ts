import { prisma } from '@/lib/prisma';
import { PRODUCT_PAGE_SIZE } from '@/shared/constants';
import {
  ProductDto,
  CreateUpdateProductDto,
  ProductCardDto,
  ProductDetailsDto,
  ProductCardWithSalesDto,
  ProductCartItemWithoutAmountDto,
} from '@/shared/dtos/product.dto';

interface CreateUpdateProductInterface
  extends Omit<CreateUpdateProductDto, 'images'> {
  images: string[];
}

interface ProductWithOwnerAndImages {
  userId: string;
  images: string[];
}

interface FindAllOptions {
  lastId?: string;
  categoryId?: number;
}

export class ProductService {
  constructor() {}

  async findAll(options?: FindAllOptions): Promise<ProductCardWithSalesDto[]> {
    const products = await prisma.product.findMany({
      where: {
        deletedAt: null,
        categories: options?.categoryId
          ? {
              some: {
                id: options.categoryId,
              },
            }
          : undefined,
      },
      cursor: options?.lastId
        ? {
            id: options.lastId,
          }
        : undefined,
      take: PRODUCT_PAGE_SIZE,
      skip: options?.lastId ? 1 : 0,
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

    const productsWithSales = await this.getSalesFromProducts(products);

    return productsWithSales;
  }

  async findAllFromUser(userId: string): Promise<ProductCardWithSalesDto[]> {
    const products = await prisma.product.findMany({
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

    const productsWithSales = await this.getSalesFromProducts(products);

    return productsWithSales;
  }

  async findAllWishedFromUser(
    userId: string,
  ): Promise<ProductCardWithSalesDto[]> {
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

    const productsWithSales = await this.getSalesFromProducts(products);

    return productsWithSales;
  }

  async findAllAsCartItems(
    cartItemIds: string[],
  ): Promise<ProductCartItemWithoutAmountDto[]> {
    return prisma.product.findMany({
      where: {
        id: { in: cartItemIds },
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        description: true,
        stock: true,
        price: true,
        images: {
          take: 1,
          select: {
            path: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findById(id: string, userId?: string): Promise<ProductDto | null> {
    const product = await prisma.product.findUnique({
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

    if (!product) return null;

    return {
      ...product,
      sales: await this.getSalesFromProduct(product.id),
    };
  }

  async findByIdWithRelatedOnes(
    id: string,
    userId?: string,
    amount: number = 6,
  ): Promise<ProductDetailsDto | null> {
    const product = await prisma.product.findUnique({
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

    if (!product) return null;

    let relatedCategories = product.categories
      .toSorted(() => 0.5 - Math.random())
      .slice(0, amount);

    const relatedProducts: ProductCardDto[] = [];

    while (relatedProducts.length < amount && relatedCategories.length !== 0) {
      for (const { id: categoryId } of relatedCategories) {
        const relatedProductCard = await prisma.product.findFirst({
          where: {
            id: {
              notIn: [
                product.id,
                ...relatedProducts.map((product) => product.id),
              ],
            },
            categories: { some: { id: categoryId } },
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

        if (relatedProductCard) {
          relatedProducts.push(relatedProductCard);
          if (relatedProducts.length === amount) break;
        } else {
          relatedCategories = relatedCategories.filter(
            (c) => c.id !== categoryId,
          );
        }
      }
    }

    const relatedProductsWithSales =
      await this.getSalesFromProducts(relatedProducts);

    return {
      product: {
        ...product,
        sales: await this.getSalesFromProduct(product.id),
      },
      relatedProducts: relatedProductsWithSales,
    };
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

    return {
      ...newProduct,
      sales: await this.getSalesFromProduct(newProduct.id),
    };
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

    return {
      ...updatedProduct,
      sales: await this.getSalesFromProduct(updatedProduct.id),
    };
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

  private async getSalesFromProducts<T extends { id: string }>(
    products: T[],
  ): Promise<(T & { sales: number })[]> {
    const productSales = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        productId: {
          in: products.map((product) => product.id),
        },
      },
      _sum: {
        amount: true,
      },
    });

    const productsWithSales = products.map((product) => {
      const productSalesFound = productSales.find(
        (p) => p.productId === product.id,
      );

      const sales = productSalesFound?._sum.amount || 0;
      return { ...product, sales };
    });

    return productsWithSales;
  }

  private async getSalesFromProduct(id: string): Promise<number> {
    const productSales = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        productId: id,
      },
      _sum: {
        amount: true,
      },
    });

    const sales = productSales[0]?._sum.amount || 0;

    return sales;
  }
}
