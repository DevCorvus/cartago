import { prisma } from '@/lib/prisma';
import {
  NewOrderDto,
  OrderCardDto,
  OrderDto,
  OrderItemDto,
} from '@/shared/dtos/order.dto';
import { getTotalMoney } from '@/lib/dinero';

interface CreateOrderItem {
  price: number;
  amount: number;
  productId: string;
}

export class OrderService {
  async findAll(userId: string): Promise<OrderCardDto[]> {
    const orders = await prisma.order.findMany({
      where: { userId, payment: { isNot: null } },
      select: {
        id: true,
        total: true,
        status: true,
        items: {
          select: {
            product: {
              select: {
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
        payment: {
          select: { status: true },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map((order) => {
      return {
        id: order.id,
        total: order.total,
        status: order.status,
        image: order.items[0].product.images[0],
        payment: order.payment!,
        createdAt: order.createdAt,
      };
    });
  }

  async findById(id: string, userId: string): Promise<OrderDto | null> {
    const order = await prisma.order.findUnique({
      where: { id, userId, payment: { isNot: null } },
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
                id: true,
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
        payment: {
          select: {
            status: true,
            method: true,
          },
        },
        createdAt: true,
      },
    });

    if (!order) return null;

    const items: OrderItemDto[] = order.items.map((item) => {
      return {
        id: item.product.id,
        title: item.product.title,
        description: item.product.description,
        price: item.price,
        amount: item.amount,
        image: item.product.images[0],
      };
    });

    return {
      id: order.id,
      total: order.total,
      status: order.status,
      items,
      payment: order.payment!,
      createdAt: order.createdAt,
    };
  }

  async create(userId: string, cartId: string): Promise<NewOrderDto> {
    // Delete "Ephimeral" orders
    await prisma.order.deleteMany({
      where: { status: 'PENDING', payment: { is: null } },
    });

    const items = await prisma.cartItem.findMany({
      where: { cartId, product: { deletedAt: null } },
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

    const total = getTotalMoney(orderItems);

    const newOrder = await prisma.order.create({
      data: {
        userId,
        total,
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
                id: true,
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
        id: item.product.id,
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

  async exists(id: string, userId?: string): Promise<boolean> {
    const count = await prisma.order.count({ where: { id, userId } });
    return count > 0;
  }

  async confirmDelivery(id: string): Promise<void> {
    await prisma.order.update({ where: { id }, data: { status: 'DELIVERED' } });
  }
}
