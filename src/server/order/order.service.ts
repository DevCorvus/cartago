import Dinero from 'dinero.js';
import { prisma } from '@/lib/prisma';
import { OrderDto, OrderItemDto } from '@/shared/dtos/order.dto';

interface CreateOrderItem {
  price: number;
  amount: number;
  productId: string;
}

export class OrderService {
  async create(cartId: string): Promise<OrderDto> {
    // Delete "Ephimeral" orders
    await prisma.order.deleteMany({
      where: { status: 'PENDING', payment: { is: null } },
    });

    const items = await prisma.cartItem.findMany({
      where: { cartId },
      select: {
        productId: true,
        amount: true,
        product: { select: { price: true } },
      },
    });

    const orderItems: CreateOrderItem[] = items.map((item) => {
      return {
        productId: item.productId,
        amount: item.amount,
        price: item.product.price,
      };
    });

    const total = orderItems.reduce(
      (total, item) => {
        return total.add(Dinero({ amount: item.price }).multiply(item.amount));
      },
      Dinero({ amount: 0 }),
    );

    const newOrder = await prisma.order.create({
      data: {
        total: total.getAmount(),
        items: {
          createMany: {
            data: orderItems,
          },
        },
      },
      select: {
        id: true,
        total: true,
        status: true,
        items: {
          select: {
            price: true,
            amount: true,
            product: {
              select: {
                title: true,
                description: true,
                images: {
                  take: 1,
                  select: {
                    path: true,
                  },
                },
              },
            },
          },
        },
        createdAt: true,
      },
    });

    const newOrderItems: OrderItemDto[] = newOrder.items.map((item) => {
      return {
        title: item.product.title,
        description: item.product.description,
        price: item.price,
        amount: item.amount,
        image: item.product.images[0],
      };
    });

    return {
      id: newOrder.id,
      total: newOrder.total,
      status: newOrder.status,
      items: newOrderItems,
      createdAt: newOrder.createdAt,
    };
  }
}
