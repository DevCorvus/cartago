import { prisma } from '@/lib/prisma';
import { OrderDto, OrderItemDto } from '@/shared/dtos/order.dto';
import { getTotalMoney } from '@/lib/dinero';
import { OrderStatus } from './order.types';

interface CreateOrderItem {
  price: number;
  amount: number;
  productId: string;
}

interface Order {
  id: string;
  total: number;
  status: OrderStatus;
  createdAt: Date;
}

export class OrderService {
  async create(cartId: string): Promise<OrderDto> {
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

  async findById(id: string): Promise<Order | null> {
    return prisma.order.findUnique({
      where: { id },
      select: { id: true, total: true, status: true, createdAt: true },
    });
  }
}
