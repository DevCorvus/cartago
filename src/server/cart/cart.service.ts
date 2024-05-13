import { prisma } from '@/lib/prisma';
import { ProductCartItemDto } from '@/shared/dtos/product.dto';
import { ProductService } from '../product/product.service';

export class CartService {
  constructor(private productService: ProductService) {}

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
    const productExists = await this.productService.exists(productId);

    if (!productExists) throw new Error('Product does not exist');

    await prisma.cartItem.create({ data: { cartId, productId, amount: 1 } });
  }

  async cartItemExists(cartId: string, productId: string): Promise<boolean> {
    const count = await prisma.cartItem.count({ where: { cartId, productId } });
    return count > 0;
  }

  async findAllItems(cartId: string): Promise<ProductCartItemDto[] | null> {
    const items = await prisma.cartItem.findMany({
      where: { cartId, product: { deletedAt: null } },
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

    if (!items) return null;

    const cartItems = items.map((item) => {
      return { id: item.productId, ...item.product, amount: item.amount };
    });

    return cartItems;
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

  async setCartItemAmount(cartId: string, productId: string, amount: number) {
    const cartItem = await prisma.cartItem.findFirst({
      where: { cartId, productId, product: { deletedAt: null } },
      select: { id: true, amount: true, product: { select: { stock: true } } },
    });

    if (!cartItem) throw new Error('Cart item does not exist');

    if (amount >= 1 && amount <= cartItem.product.stock) {
      await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: {
          amount: {
            set: amount,
          },
        },
      });
    } else {
      throw new Error('New cart item amount is out of boundaries');
    }
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

  async syncCartItemAmountsToStock(cartId: string) {
    const items = await prisma.cartItem.findMany({
      where: { cartId },
      select: {
        id: true,
        amount: true,
        product: { select: { stock: true } },
      },
    });

    const itemsToSync = items
      .filter((item) => item.amount > item.product.stock)
      .map((item) => ({
        id: item.id,
        amount: item.product.stock,
      }));

    for (const { id, amount } of itemsToSync) {
      await prisma.cartItem.update({ where: { id }, data: { amount } });
    }
  }
}
