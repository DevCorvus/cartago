import { OrderStatus } from '@/server/order/order.types';
import { ProductImageDto } from './product.dto';
import { PaymentStatus } from '@/server/payment/payment.types';
import { PaymentMethod } from './payment.dto';

export interface OrderItemDto {
  id: string;
  title: string;
  description: string;
  amount: number;
  price: number;
  image: ProductImageDto;
}

export interface NewOrderDto {
  id: string;
  total: number;
  status: OrderStatus;
  items: OrderItemDto[];
  createdAt: Date;
}

export interface OrderCardDto {
  id: string;
  total: number;
  status: OrderStatus;
  image: ProductImageDto;
  payment: { status: PaymentStatus };
  createdAt: Date;
}

export interface OrderDto {
  id: string;
  total: number;
  status: OrderStatus;
  items: OrderItemDto[];
  payment: {
    status: PaymentStatus;
    method: PaymentMethod;
  };
  createdAt: Date;
}
