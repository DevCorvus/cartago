import { OrderStatus, ShipmentStatus } from '@/server/order/order.types';
import { ProductImageDto } from './product.dto';
import { PaymentStatus } from '@/server/payment/payment.types';
import { PaymentMethod } from './payment.dto';

export interface OrderItemDto {
  id: string;
  title: string;
  amount: number;
  price: number;
  image: ProductImageDto;
}

export interface NewCheckoutOrderDto {
  id: string;
}

export interface CheckoutOrderDto {
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

interface Shipment {
  status: ShipmentStatus;
}

export interface OrderDto {
  id: string;
  total: number;
  status: OrderStatus;
  items: OrderItemDto[];
  address: {
    nickname: string;
  };
  payment: {
    status: PaymentStatus;
    method: PaymentMethod;
  };
  shipment: Shipment | null;
  createdAt: Date;
}
