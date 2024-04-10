import { prisma } from '@/lib/prisma';
import {
  CheckoutOrderDto,
  OrderCardDto,
  OrderDto,
  OrderItemDto,
} from '@/shared/dtos/order.dto';
import { getTotalMoney } from '@/lib/dinero';
import { OrderStatus } from './order.types';
import { PaymentMethod } from '@/shared/dtos/payment.dto';

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
        address: {
          select: {
            nickname: true,
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
        address: {
          select: {
            nickname: true,
          },
        },
        payment: {
          select: {
            status: true,
            method: true,
          },
        },
        shipment: {
          select: {
            status: true,
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
      address: order.address!,
      payment: {
        status: order.payment!.status,
        method: order.payment!.method as PaymentMethod,
      },
      shipment: order.shipment,
      createdAt: order.createdAt,
    };
  }

  async findCheckoutOrderById(
    id: string,
    userId: string,
  ): Promise<CheckoutOrderDto | null> {
    const checkoutOrder = await prisma.order.findUnique({
      where: { id, userId, status: 'PENDING', payment: { is: null } },
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

    if (!checkoutOrder) return null;

    const checkoutOrderItems: OrderItemDto[] = checkoutOrder.items.map(
      (item) => {
        return {
          id: item.product.id,
          title: item.product.title,
          description: item.product.description,
          price: item.price,
          amount: item.amount,
          image: item.product.images[0],
        };
      },
    );

    return {
      id: checkoutOrder.id,
      total: checkoutOrder.total,
      status: checkoutOrder.status,
      items: checkoutOrderItems,
      createdAt: checkoutOrder.createdAt,
    };
  }

  async create(userId: string, cartId: string): Promise<{ id: string }> {
    // Delete "Ephimeral" orders
    await prisma.order.deleteMany({
      where: { status: 'PENDING', payment: { is: null } },
    });

    const items = await prisma.cartItem.findMany({
      where: { cartId, product: { deletedAt: null } },
      select: {
        productId: true,
        amount: true,
        product: { select: { price: true, stock: true } },
      },
    });

    if (items.some((item) => item.amount > item.product.stock)) {
      throw new Error('Product stock does not fulfill order');
    }

    const orderItems: CreateOrderItem[] = items.map((item) => {
      return {
        productId: item.productId,
        amount: item.amount,
        price: item.product.price,
      };
    });

    const total = getTotalMoney(orderItems);

    return prisma.order.create({
      data: {
        userId,
        total,
        items: {
          createMany: {
            data: orderItems,
          },
        },
      },
      select: { id: true },
    });
  }

  async exists(id: string, userId?: string): Promise<boolean> {
    const count = await prisma.order.count({ where: { id, userId } });
    return count > 0;
  }

  async getStatus(id: string): Promise<OrderStatus | null> {
    const order = await prisma.order.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!order) return null;

    return order.status;
  }

  async confirmDelivery(id: string): Promise<void> {
    await prisma.order.update({ where: { id }, data: { status: 'DELIVERED' } });
  }

  async productHasBeenOrderedAndDelivered(userId: string, productId: string) {
    const count = await prisma.order.count({
      where: {
        userId,
        status: 'DELIVERED',
        items: { some: { productId } },
      },
    });
    return count > 0;
  }
}
