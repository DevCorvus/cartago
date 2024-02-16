import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/server/auth/auth.utils';
import { Params } from '@/shared/dtos/params.dto';
import { paramsSchema } from '@/shared/schemas/params.schema';
import { createPaymentSchema } from '@/shared/schemas/payment.schema';
import { NextRequest, NextResponse } from 'next/server';

interface Props {
  params: Params;
}

export async function POST(req: NextRequest, { params }: Props) {
  const user = await getUserSession();

  if (!user) {
    return NextResponse.json(null, { status: 401 });
  }

  const paramsResult = await paramsSchema.safeParseAsync(params);

  if (!paramsResult.success) {
    return NextResponse.json(null, { status: 400 });
  }

  const json = await req.json();
  const jsonResult = await createPaymentSchema.safeParseAsync(json);

  if (!jsonResult.success) {
    return NextResponse.json(null, { status: 400 });
  }

  const orderId = paramsResult.data.id;
  const data = jsonResult.data;

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUniqueOrThrow({
        where: { id: orderId },
        select: {
          total: true,
          items: { select: { productId: true, amount: true } },
        },
      });

      await tx.payment.create({
        data: {
          orderId,
          method: data.method,
          total: order.total,
        },
      });

      await tx.cartItem.deleteMany({ where: { cartId: user.cartId } });

      for (const item of order.items) {
        const product = await tx.product.findUniqueOrThrow({
          where: { id: item.productId, deletedAt: null },
          select: {
            stock: true,
          },
        });

        if (product.stock >= item.amount) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.amount } },
          });
        } else {
          throw new Error('Product stock does not fulfill order');
        }
      }
    });

    return NextResponse.json(null, { status: 201 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
