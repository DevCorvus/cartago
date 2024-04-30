import { prisma } from '@/lib/prisma';
import { PRODUCT_PAGE_SIZE } from '@/shared/constants';
import {
  ProductDto,
  CreateProductDto,
  ProductCardDto,
  ProductDetailsDto,
  ProductCartItemWithoutAmountDto,
  ProductRating,
  ProductCard,
  NewProductDto,
  UpdateProductDto,
} from '@/shared/dtos/product.dto';
import { StorageService } from '../storage/storage.service';

interface ProductWithOwnerAndImages {
  userId: string;
  images: string[];
}

interface FindAllOptions {
  lastId?: string;
  categoryId?: number;
}

export class ProductService {
  constructor(private storageService: StorageService) {}

  async findAll(options?: FindAllOptions): Promise<ProductCardDto[]> {
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

    const productsWithSalesAndRating =
      await this.getRatingFromProducts(productsWithSales);

    return productsWithSalesAndRating;
  }

  async findAllFromUser(userId: string): Promise<ProductCardDto[]> {
    const products = await prisma.product.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
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

    const productsWithSalesAndRating =
      await this.getRatingFromProducts(productsWithSales);

    return productsWithSalesAndRating;
  }

  async findAllWishedFromUser(userId: string): Promise<ProductCardDto[]> {
    const wishedItems = await prisma.wishedItem.findMany({
      where: { userId, product: { deletedAt: null } },
      select: {
        product: {
          select: {
            id: true,
            title: true,
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

    const productsWithSalesAndRating =
      await this.getRatingFromProducts(productsWithSales);

    return productsWithSalesAndRating;
  }

  async findAllWishedFromIds(productIds: string[]): Promise<ProductCardDto[]> {
    const wishedProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, deletedAt: null },
      select: {
        id: true,
        title: true,
        price: true,
        images: {
          take: 1,
          select: {
            path: true,
          },
        },
      },
    });

    const productsWithSales = await this.getSalesFromProducts(wishedProducts);

    const productsWithSalesAndRating =
      await this.getRatingFromProducts(productsWithSales);

    return productsWithSalesAndRating;
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

  async findByIdWithRelatedOnes(
    id: string,
    userId?: string,
    amount: number = 6,
  ): Promise<ProductDetailsDto | null> {
    const product = await prisma.product.findUnique({
      where: { id, userId, deletedAt: null },
      select: {
        userId: true,
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

    const relatedProducts: ProductCard[] = [];

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

    const relatedProductsWithSalesAndRating = await this.getRatingFromProducts(
      relatedProductsWithSales,
    );

    return {
      isOwner: !!userId && userId === product.userId,
      product: {
        id: product.id,
        title: product.title,
        description: product.description,
        stock: product.stock,
        price: product.price,
        images: product.images,
        categories: product.categories,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        sales: await this.getSalesFromProduct(product.id),
        rating: await this.getRatingFromProduct(product.id),
      },
      relatedProducts: relatedProductsWithSalesAndRating,
    };
  }

  async findOwnerId(id: string): Promise<string | null> {
    const product = await prisma.product.findUnique({
      where: { id, deletedAt: null },
      select: {
        userId: true,
      },
    });

    if (!product) return null;

    return product.userId;
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

  async create(userId: string, data: CreateProductDto): Promise<NewProductDto> {
    let images;

    try {
      images = await this.storageService.saveMany(data.images);

      return prisma.product.create({
        data: {
          userId,
          title: data.title,
          description: data.description,
          price: data.price,
          stock: data.stock,
          images: {
            createMany: {
              data: images.map((path) => ({
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
        select: {
          id: true,
        },
      });
    } catch (err) {
      if (images) {
        // TODO: Handle error
        await this.storageService.deleteMany(images);
      }

      throw err;
    }
  }

  async update(
    id: string,
    userId: string,
    data: UpdateProductDto,
  ): Promise<void> {
    // TODO: A lot more edge cases to take into consideration

    const productImages = await prisma.productImage.findMany({
      where: { productId: id },
      select: { id: true, path: true },
    });

    const productImagesToDelete = productImages.filter(
      (image) =>
        !data.imageFilenamesToKeep.some((filename) => filename === image.path),
    );

    const productImageFilenamesToDelete = productImagesToDelete.map(
      (image) => image.path,
    );

    await this.storageService.deleteMany(productImageFilenamesToDelete);

    const newProductImages = data.images.filter(
      (file) =>
        !data.imageFilenamesToKeep.some((filename) => filename === file.name),
    );

    const newProductImageFilenames =
      await this.storageService.saveMany(newProductImages);

    try {
      await prisma.product.update({
        where: { id, userId },
        data: {
          userId,
          title: data.title,
          description: data.description,
          price: data.price,
          stock: data.stock,
          images: {
            deleteMany: {
              id: { in: productImagesToDelete.map((image) => image.id) },
            },
            createMany: {
              data: newProductImageFilenames.map((filename) => ({
                path: filename,
              })),
            },
          },
          categories: {
            set: data.categories.map((categoryId) => ({ id: categoryId })),
          },
        },
      });
    } catch {
      await this.storageService.restoreMany(productImageFilenamesToDelete);
      await this.storageService.deleteMany(newProductImageFilenames);
    }
  }

  async delete(id: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // TODO: Notify these
      await tx.cartItem.deleteMany({ where: { productId: id } });

      await tx.product.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
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

  private async getRatingFromProducts<T extends { id: string }>(
    products: T[],
  ): Promise<(T & { rating: ProductRating })[]> {
    const productRatings = await prisma.productReview.groupBy({
      by: ['productId'],
      where: {
        productId: {
          in: products.map((product) => product.id),
        },
      },
      _count: true,
      _avg: {
        rating: true,
      },
    });

    const productsWithRatings = products.map((product) => {
      const rating = productRatings.find((p) => p.productId === product.id);

      const count = rating?._count || 0;
      const score = rating?._avg.rating || 0;

      return { ...product, rating: { count, score } };
    });

    return productsWithRatings;
  }

  private async getRatingFromProduct(id: string): Promise<ProductRating> {
    const productRating = await prisma.productReview.groupBy({
      by: ['productId'],
      where: {
        productId: id,
      },
      _avg: {
        rating: true,
      },
      _sum: {
        rating: true,
      },
    });

    const product = productRating[0];

    const count = product?._sum.rating || 0;
    const score = product?._avg.rating || 0;

    return {
      count,
      score,
    };
  }
}
