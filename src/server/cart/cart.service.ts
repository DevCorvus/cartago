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
      orderBy: {
        createdAt: 'asc',
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

  async incrementCartItemAmount(
    cartId: string,
    productId: string,
  ): Promise<boolean> {
    const cartItem = await prisma.cartItem.findFirst({
      where: { cartId, productId },
      select: { id: true, amount: true, product: { select: { stock: true } } },
    });

    if (cartItem && cartItem.amount < cartItem.product.stock) {
      await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: {
          amount: {
            increment: 1,
          },
        },
      });
      return true;
    }

    return false;
  }

  async decrementCartItemAmount(
    cartId: string,
    productId: string,
  ): Promise<boolean> {
    const cartItem = await prisma.cartItem.findFirst({
      where: { cartId, productId },
      select: { id: true, amount: true, product: { select: { stock: true } } },
    });

    if (cartItem && cartItem.amount > 1) {
      await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: {
          amount: {
            decrement: 1,
          },
        },
      });
      return true;
    }

    return false;
  }

  async removeItemFromCart(cartId: string, productId: string): Promise<void> {
    const cartItem = await prisma.cartItem.findFirst({
      where: { cartId, productId },
      select: { id: true },
    });

    if (cartItem) {
      await prisma.cartItem.delete({ where: { id: cartItem.id } });
    }
  }
}
