import { prisma } from '@/lib/prisma';
import { ProductCartItemDto } from '@/shared/dtos/product.dto';

export class CartService {
  async create(userId: string): Promise<void> {
    await prisma.cart.create({ data: { userId } });
  }

  async findUserCartId(userId: string): Promise<string | null> {
    const data = await prisma.cart.findUnique({
      where: { userId },
      select: { id: true },
    });

    return data ? data.id : null;
  }

  async addItem(cartId: string, productId: string): Promise<void> {
    await prisma.cartItem.create({ data: { cartId, productId, amount: 1 } });
  }

  async cartItemExists(cartId: string, productId: string): Promise<boolean> {
    const count = await prisma.cartItem.count({ where: { cartId, productId } });
    return count > 0;
  }

  async findAllItems(cartId: string): Promise<ProductCartItemDto[] | null> {
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId },
      include: {
        product: {
          select: {
            title: true,
            description: true,
            price: true,
            stock: true,
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

    const cartProductsWithAmount = cartItems
      ? cartItems.map((item) => {
          return { id: item.productId, ...item.product, amount: item.amount };
        })
      : null;

    return cartProductsWithAmount;
  }

  async findAllItemIds(cartId: string): Promise<string[] | null> {
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId },
      select: {
        productId: true,
      },
    });

    return cartItems ? cartItems.map((item) => item.productId) : null;
  }
}
