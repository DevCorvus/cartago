import { prisma } from '@/lib/prisma';
import { CreatePaymentDto } from '@/shared/dtos/payment.dto';
import { OrderService } from '../order/order.service';

export class PaymentService {
  constructor(private orderService: OrderService) {}

  async create(
    userId: string,
    orderId: string,
    data: CreatePaymentDto,
  ): Promise<boolean> {
    const order = await this.orderService.findById(orderId);

    if (!order) return false;

    await prisma.payment.create({
      data: {
        userId,
        orderId,
        total: order.total,
        method: data.method,
      },
    });

    return true;
  }
}
